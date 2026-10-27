import fs from "node:fs";
import os from "node:os";
import { execSync } from "node:child_process";
import { ask, getArgs, getInstallCommands, log, readPem, rsync, ssh, sshOutput, sshTest } from "./utils.ts";

const args = getArgs();
const sshHost = args.host;
const domain = args.dir;
const appDir = `/var/www/${domain}`;
const nextDir = `${appDir}_next`;
const prevDir = `${appDir}_prev`;
const tmpDir = `${appDir}_tmp`;
const appName = args.name || domain?.split(".")[0];
const pm = getInstallCommands(args.pm);
const nginxSite = `/etc/nginx/sites-available/${domain}`;
// Local folder for the Cloudflare origin certificate, kept outside the repo
const certDir = `${os.homedir()}/.cloudflare`;
const pemFile = `${certDir}/${domain}.pem`;
const keyFile = `${certDir}/${domain}.key`;
// Server-only files that move from the old release into the new one, such as the SQLite database
const keepPaths = ["db"];
// Non-interactive SSH skips ~/.bashrc, so load nvm when the server uses it
const loadNode = "source ~/.nvm/nvm.sh 2>/dev/null || true";

// STOP WHEN CONFIG IS MISSING, since --port and --i are only needed when the app is not running yet
if (!sshHost || !domain || !appName) {
	log.error("Pass --host and --dir, such as --host deploy@1.2.3.4 --dir example.com");
	process.exit(1);
}

// STOP IF NO PACKAGE MANAGER
if (!pm) {
	log.error("Pass --pm as npm, bun, pnpm, or yarn");
	process.exit(1);
}

// STOP IF THE MODE IS UNKNOWN
if (!["deploy", "setup", "rollback", "remove"].includes(args.mode)) {
	log.error("Pass deploy, setup, rollback, or remove as the mode, such as `node src/lib/server/deploy/index.ts rollback --host …`");
	process.exit(1);
}

// STOP IF THE INSTANCE COUNT IS INVALID
if (args.i && args.i !== "max" && !/^[1-9]\d*$/.test(args.i)) {
	log.error("Pass --i as a number or max, such as --i max");
	process.exit(1);
}

// STOP IF THE LOCK FILE IS MISSING, since the server installs from it
if (args.mode === "deploy" && !fs.existsSync(pm.lockFile)) {
	log.error(`Missing ${pm.lockFile}. Run ${args.pm} install first, or pass the --pm you use.`);
	process.exit(1);
}

/** Shell lines that move the server-only files from one release folder into another */
function keep(from: string, to: string) {
	return keepPaths.map((path) => `if [ -e ${from}/${path} ]; then rm -rf ${to}/${path} && mv ${from}/${path} ${to}/${path}; fi`);
}

/** Read how pm2 runs the app on the server, or undefined when it is not running */
function getServerApp() {
	// Print the core count first and the pm2 list last, since pm2 may print notices before its JSON
	const lines = sshOutput(sshHost!, `${loadNode}; nproc; pm2 jlist 2>/dev/null || echo "[]"`).trim().split("\n");
	const cores = lines[0];
	let processes: Pm2Process[];
	try {
		processes = JSON.parse(lines.at(-1) ?? "").filter((item: Pm2Process) => item.name === appName);
	} catch {
		log.error("Could not read the pm2 process list on the server. Run `pm2 jlist` there to check it.");
		process.exit(1);
	}
	// If no process has the app name: the app is not running
	if (processes.length === 0) return;
	const env = processes[0].pm2_env;
	return { cluster: env.exec_mode === "cluster_mode", count: processes.length, port: env.env?.PORT ?? env.PORT, nodeArgs: Array.isArray(env.node_args) ? env.node_args.join(" ") : (env.node_args ?? ""), cores };
}

/** Shell lines that reload the app, or start it with its port, env files, and instance count when it is not running or its settings change */
function restart() {
	const app = getServerApp();
	// Leaving out --port or --i keeps what the running app uses
	const port = args.port ?? app?.port;
	const instances = args.i ?? (app?.cluster ? String(app.count) : undefined);
	// If the app is not running and no port is given: stop, since the first start needs one
	if (!port) {
		log.error("Pass --port, since the app is not running on the server yet, such as --port 8000");
		process.exit(1);
	}
	// Node does not load .env on its own, so pm2 passes the env files to it by full path, since cluster workers start outside the app folder and would miss a relative .env
	const env = `NODE_ENV=production HOST=127.0.0.1 PORT=${port} PROTOCOL_HEADER=x-forwarded-proto ADDRESS_HEADER=CF-Connecting-IP`;
	// The --i flag runs the app in pm2 cluster mode, with that many processes behind one port
	const cluster = instances ? ` -i ${instances}` : "";
	// A 35 second kill timeout outlasts the 30 second SHUTDOWN_TIMEOUT of adapter-node, so pending requests finish on a restart
	// adapter-node closes the server on shutdown but never exits, and pm2's IPC channel keeps Node alive, so exit once open requests finish instead of waiting for SIGKILL
	const exitOnShutdown = "--import=data:text/javascript,process.on('sveltekit:shutdown',()=>process.exit(0))";
	const nodeArgs = `--env-file-if-exists=${appDir}/.env --env-file-if-exists=${appDir}/.env.production ${exitOnShutdown}`;
	const start = `${env} pm2 start build/index.js --name ${appName}${cluster} --kill-timeout 35000 --node-args="${nodeArgs}"`;
	const wantedCount = args.i === "max" ? app?.cores : args.i;
	// If a running app moves to a new port: warn, since the nginx site keeps proxying to the old one
	if (app && args.port && args.port !== app.port) log.normal(`The port changes from ${app.port} to ${args.port}, so update proxy_pass in ${nginxSite} and reload nginx`);
	const changed = (args.port && args.port !== app?.port) || (args.i && !(app?.cluster && String(app.count) === wantedCount)) || app?.nodeArgs !== nodeArgs;

	// If the app is not running: start it. If --port, --i, or the Node.js flags changed: recreate it, since pm2 cannot change them on a reload. Otherwise: reload it, with no downtime in cluster mode.
	const command = !app ? start : changed ? `pm2 delete ${appName}; ${start}` : `pm2 reload ${appName}`;
	return [`cd ${appDir}`, command, "pm2 save"];
}

/** Get the Cloudflare origin certificate onto the server, asking for it the first time and saving it on this machine */
async function setupCerts() {
	// If the server already has the certificate: nothing to upload
	if (sshTest(sshHost!, `test -f /etc/ssl/cloudflare/${domain}.pem`)) return;

	// If this machine has no saved certificate: print the Cloudflare steps and ask for it
	if (!fs.existsSync(pemFile) || !fs.existsSync(keyFile)) {
		log.normal(`\nCloudflare setup for ${domain}:`);
		console.log(`  1. DNS: add an A record for ${domain} pointing to ${sshHost!.split("@").pop()}, Proxied`);
		console.log("  2. SSL/TLS > Overview: set the encryption mode to Full (strict)");
		console.log(`  3. SSL/TLS > Origin Server > Create Certificate, keeping ${domain} and *.${domain}\n`);

		// If there is no terminal to paste into: ask for the files instead
		if (!process.stdin.isTTY) {
			log.error(`Save the certificate as ${pemFile} and the private key as ${keyFile}, then rerun.`);
			process.exit(1);
		}
		fs.mkdirSync(certDir, { recursive: true, mode: 0o700 });
		await readPem(pemFile, "Paste the Origin Certificate, then press Return:");
		await readPem(keyFile, "Paste the Private Key, then press Return:");
		log.successful(`Saved the certificate to ${certDir}`);
	}
	rsync([pemFile, keyFile, `${sshHost}:.deploy-certs/`]);
}

/** Create the certificate, nginx site, and /var/www access for the domain, safe to run again */
async function setup() {
	// If the nginx site is missing and no port is given: stop, since the site proxies to that port
	if (!args.port && !sshTest(sshHost!, `test -f ${nginxSite}`)) {
		log.error("Pass --port, since the nginx site for the domain does not exist yet, such as --port 8000");
		process.exit(1);
	}
	await setupCerts();
	log.normal(`Setting up ${domain} on server`);
	ssh(
		sshHost!,
		[
			// Install the uploaded certificate, then delete the upload
			"if [ -d ~/.deploy-certs ]; then",
			"sudo mkdir -p /etc/ssl/cloudflare",
			`sudo install -m 644 ~/.deploy-certs/${domain}.pem /etc/ssl/cloudflare/${domain}.pem`,
			`sudo install -m 600 ~/.deploy-certs/${domain}.key /etc/ssl/cloudflare/${domain}.key`,
			"rm -rf ~/.deploy-certs",
			"fi",
			// Create the nginx site only once, so later edits to it survive
			`if [ ! -f ${nginxSite} ]; then`,
			`sudo tee ${nginxSite} >/dev/null <<'NGINX'`,
			`server {
    listen 80;
    listen [::]:80;
    server_name ${domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${domain};

    ssl_certificate /etc/ssl/cloudflare/${domain}.pem;
    ssl_certificate_key /etc/ssl/cloudflare/${domain}.key;

    location / {
        proxy_pass http://127.0.0.1:${args.port};
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
			"NGINX",
			"fi",
			// Enable the site, then reload nginx only when the config is valid
			`sudo ln -sf ${nginxSite} /etc/nginx/sites-enabled/`,
			"sudo nginx -t",
			"sudo systemctl reload nginx",
			// Let the deploy user create the _next and _prev folders next to the app
			"sudo mkdir -p /var/www",
			'sudo chown "$(id -un):$(id -un)" /var/www',
		],
		true,
	);
	log.successful(`Set up ${domain}`);
}

// REMOVE: delete the app, its nginx site, and its certificate, leaving nginx, Node.js, and pm2 installed
if (args.mode === "remove") {
	// Confirm by typing the domain, since the app folder holds the database
	if (!process.stdin.isTTY) {
		log.error("Run remove from a terminal, so it can ask for confirmation.");
		process.exit(1);
	}
	log.normal(`This deletes ${appDir} (including db), ${prevDir}, the nginx site, and the Cloudflare certificate for ${domain}.`);
	if ((await ask(`Type ${domain} to confirm: `)) !== domain) {
		log.error("Cancelled");
		process.exit(1);
	}
	ssh(
		sshHost,
		[
			loadNode,
			// Stop the app and drop it from the boot list
			`if pm2 describe ${appName} >/dev/null 2>&1; then pm2 delete ${appName} && pm2 save --force; fi`,
			`rm -rf ${appDir} ${prevDir} ${nextDir} ${tmpDir}`,
			// Delete the nginx site, then reload nginx without it
			`sudo rm -f /etc/nginx/sites-enabled/${domain} ${nginxSite}`,
			"if sudo nginx -t >/dev/null 2>&1; then sudo systemctl reload nginx; fi",
			// Delete the certificate and any upload left from a failed setup
			`sudo rm -f /etc/ssl/cloudflare/${domain}.pem /etc/ssl/cloudflare/${domain}.key`,
			"rm -rf ~/.deploy-certs",
		],
		true,
	);
	log.successful(`Removed ${domain} from the server`);

	// If this machine has a saved certificate: offer to delete it too
	if ((fs.existsSync(pemFile) || fs.existsSync(keyFile)) && (await ask(`Also delete the local certificate in ${certDir}? [y/N] `)).toLowerCase() === "y") {
		fs.rmSync(pemFile, { force: true });
		fs.rmSync(keyFile, { force: true });
		log.successful("Deleted the local certificate");
	}
	process.exit(0);
}

// SETUP: rerun the domain setup only, such as to recreate a missing certificate or nginx site
if (args.mode === "setup") {
	await setup();
	process.exit(0);
}

// ROLLBACK: swap the live and previous releases, so a second rollback returns to the newer one
if (args.mode === "rollback") {
	log.normal(`Rolling back to ${prevDir}`);
	ssh(sshHost, [loadNode, `if [ ! -d ${prevDir} ]; then echo "No previous release at ${prevDir}" >&2; exit 1; fi`, `rm -rf ${tmpDir}`, `mv ${appDir} ${tmpDir}`, `mv ${prevDir} ${appDir}`, ...keep(tmpDir, appDir), `mv ${tmpDir} ${prevDir}`, ...restart()]);
	log.successful(`Rolled back ${appName}`);
	process.exit(0);
}

// READ THE RUNNING APP before building, so a missing --port stops before anything changes
const restartLines = restart();

// BUILD APP first, so a broken build stops before the server changes
log.normal("Building app");
execSync(`${args.pm} run build`, { stdio: "inherit" });
log.successful("Built app");

// SET UP THE DOMAIN on the first deploy, when the server has no nginx site for it yet
if (!sshTest(sshHost, `test -f ${nginxSite}`)) await setup();

// COPY FILES TO A STAGING FOLDER, so the live app keeps running
log.normal(`Copying files to ${nextDir}`);
ssh(sshHost, [`rm -rf ${nextDir}`, `mkdir -p ${nextDir}`]);
rsync(["--delete", "build/", `${sshHost}:${nextDir}/build/`]);
const extraFiles = ["package.json", pm.lockFile, ...pm.configFiles, ".env", ".env.production"].filter((file) => fs.existsSync(file));
rsync([...extraFiles, `${sshHost}:${nextDir}/`]);
log.successful("Copied files");

// INSTALL, SWAP RELEASES, AND RESTART WITH PM2 ON SERVER
log.normal("Installing and swapping releases on server");
ssh(sshHost, [
	loadNode,
	`cd ${nextDir}`,
	// Make the env files readable only by the server user
	"chmod 600 .env .env.production 2>/dev/null || true",
	pm.install,
	"cd ~",
	// If a release is live: keep it as _prev and move its server-only files over. Otherwise: this is the first deploy.
	`if [ -d ${appDir} ]; then`,
	`rm -rf ${prevDir}`,
	`mv ${appDir} ${prevDir}`,
	`mv ${nextDir} ${appDir}`,
	...keep(prevDir, appDir),
	"else",
	`mv ${nextDir} ${appDir}`,
	"fi",
	...restartLines,
]);
log.successful(`Deployed ${appName} to https://${domain}`);

/** One process from `pm2 jlist` */
interface Pm2Process {
	/** pm2 app name */
	name: string;
	/** pm2 settings and env vars of the process */
	pm2_env: { exec_mode: string; node_args?: string[] | string; PORT?: string; env?: { PORT?: string } };
}
