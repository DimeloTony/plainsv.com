import fs from "node:fs";
import readline from "node:readline/promises";
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";

// Reuse one SSH connection for every step, so the login happens once
const sshOptions = ["-o", "ControlMaster=auto", "-o", "ControlPath=~/.ssh/deploy-%C", "-o", "ControlPersist=60"];

/** Read the deploy mode and flags, such as `rollback --host deploy@1.2.3.4 --dir example.com --pm pnpm` */
export function getArgs() {
	const { values, positionals } = parseArgs({
		allowPositionals: true,
		options: {
			// SSH user and host, such as deploy@1.2.3.4
			host: { type: "string" },
			// Domain, which also names the app folder in /var/www, the nginx site, and the certificate, such as example.com
			dir: { type: "string" },
			// pm2 app name, defaults to the first part of --dir, such as example
			name: { type: "string" },
			// Port the app listens on behind nginx, such as 8000
			port: { type: "string" },
			// Number of cluster instances, or max for one per CPU core; leave out for one process
			i: { type: "string" },
			// Package manager that builds locally and installs production dependencies on the server: npm, bun, pnpm, or yarn
			pm: { type: "string", default: "pnpm" },
		},
	});
	// The first positional picks the mode: deploy by default, or setup, rollback, or remove
	return { ...values, mode: positionals[0] ?? "deploy" };
}

/** Return the production install command, lock file, and config files for a package manager, or undefined when it is unsupported */
export function getInstallCommands(pm: string) {
	// Config files go to the server so its install follows the same policies, such as pnpm's minimumReleaseAgeExclude
	const commands: Record<string, { install: string; lockFile: string; configFiles: string[] }> = {
		npm: { install: "npm ci --omit=dev", lockFile: "package-lock.json", configFiles: [".npmrc"] },
		bun: { install: "bun install --production --frozen-lockfile", lockFile: "bun.lock", configFiles: ["bunfig.toml", ".npmrc"] },
		pnpm: { install: "pn install --prod --frozen-lockfile", lockFile: "pnpm-lock.yaml", configFiles: ["pnpm-workspace.yaml", ".npmrc"] },
		yarn: { install: "yarn install --production --frozen-lockfile", lockFile: "yarn.lock", configFiles: [".yarnrc.yml", ".yarnrc", ".npmrc"] },
	};
	return commands[pm];
}

/** Run a shell script on the server, stopping at the first failed command; `tty` lets sudo ask for a password */
export function ssh(host: string, lines: string[], tty = false) {
	const ttyFlag = tty && process.stdin.isTTY ? ["-t"] : [];
	execFileSync("ssh", [...sshOptions, ...ttyFlag, host, ["set -e", ...lines].join("\n")], { stdio: "inherit" });
}

/** Return whether a command succeeds on the server, such as `test -f /etc/nginx/sites-available/example.com` */
export function sshTest(host: string, command: string) {
	try {
		execFileSync("ssh", [...sshOptions, host, command], { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

/** Run a command on the server and return what it prints */
export function sshOutput(host: string, command: string) {
	return execFileSync("ssh", [...sshOptions, host, command], { encoding: "utf8" });
}

/** Copy local files to the server */
export function rsync(args: string[]) {
	execFileSync("rsync", ["-az", "-e", `ssh ${sshOptions.join(" ")}`, ...args], { stdio: "inherit" });
}

/** Ask a question in the terminal and return the trimmed answer */
export async function ask(question: string) {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	const answer = await rl.question(question);
	rl.close();
	return answer.trim();
}

/** Save pasted PEM text to a file, stopping at its -----END line so no Ctrl-D is needed */
export async function readPem(file: string, prompt: string) {
	console.log(prompt);
	const rl = readline.createInterface({ input: process.stdin });
	const lines: string[] = [];
	for await (const line of rl) {
		lines.push(line);
		if (line.startsWith("-----END")) break;
	}
	rl.close();
	const text = lines.join("\n");
	// If the paste is not PEM text: stop without saving, so the next run asks again
	if (!text.includes("-----BEGIN") || !text.includes("-----END")) {
		log.error("That did not look like a certificate or key. Rerun and paste it again.");
		process.exit(1);
	}
	fs.writeFileSync(file, `${text}\n`, { mode: 0o600 });
}

/** log message with colors */
export const log = {
	normal: (data: string) => console.log(`\x1B[34m${data}\x1b[0m`),
	error: (data: string) => console.log(`\x1b[31m${data}\x1b[0m`),
	successful: (data: string) => console.log(`\x1b[32m${data}\x1b[0m`),
};
