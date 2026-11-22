import { AuthSession, type AuthUserProfile } from "./session.js";

/** Authenticate user using github
 * 1. From `api/auth/github/+server.ts`: save a random state to the `github_oauth_state` cookie and redirect the user to github.com using createAuthorizationURL
 * 2. From `api/auth/github/callback/+server.ts`: check the state from the url matches the cookie, then exchange the code from the url for an access token using validateAuthorizationCode
 * 3. From `api/auth/github/callback/+server.ts`: load the user's id, primary verified email, and avatar from the GitHub API using getUser, then find or create the user in the database
 * 4. From `api/auth/github/callback/+server.ts`: create a session using generateSessionToken and createSession, then save its token to the `session` cookie using setSessionTokenCookie
 * 5. From `hooks.server.ts`: run hook before the main handle with `sequence`, which loads the session and user from the `session` cookie on every request using validateSessionToken
 * 6. From `api/auth/signout/+server.ts`: sign the user out using invalidateSession and deleteSessionTokenCookie */
class GithubAuth extends AuthSession {
	/** Build the GitHub sign in URL from the state and scopes */
	createAuthorizationURL(state: string, scopes: string[], redirectURI?: string) {
		const url = new URL("https://github.com/login/oauth/authorize");
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
		url.searchParams.set("state", state);
		// If scopes were given: add them, space separated.
		if (scopes.length > 0) url.searchParams.set("scope", scopes.join(" "));
		// If a redirect URI was given: send it, otherwise GitHub uses the one set in the OAuth app.
		if (redirectURI) url.searchParams.set("redirect_uri", redirectURI);
		return url;
	}

	/** Exchange the callback code for an access token */
	async validateAuthorizationCode(code: string) {
		const res = await fetch("https://github.com/login/oauth/access_token", {
			method: "POST",
			headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
		});
		const data: { access_token: string; scope: string } | { error: string; error_description?: string } = await res.json();
		// GitHub answers failed exchanges with status 200, so check the body for an error.
		if ("error" in data) throw new Error(data.error_description ?? data.error);
		return { accessToken: data.access_token, scopes: data.scope.split(",") };
	}

	/** Load the user's id, primary verified email, and avatar from the GitHub API with the access token */
	async getUser(tokens: { accessToken: string }): Promise<AuthUserProfile> {
		const headers = { Authorization: `Bearer ${tokens.accessToken}`, Accept: "application/vnd.github+json" };
		// Load the user and their emails in parallel.
		const [userRes, emailsRes] = await Promise.all([fetch("https://api.github.com/user", { headers }), fetch("https://api.github.com/user/emails", { headers })]);
		// If either request failed: throw an error.
		if (!userRes.ok || !emailsRes.ok) throw new Error("Could not load your GitHub profile.");
		const user: { id: number; login: string } = await userRes.json();
		const emails: { email: string; primary: boolean; verified: boolean }[] = await emailsRes.json();
		const primaryEmail = emails.find((data) => data.primary && data.verified);
		// If there is no primary verified email: throw an error.
		if (!primaryEmail) throw new Error("Your GitHub email must be verified to continue.");
		return { id: user.id.toString(), email: primaryEmail.email, image: `https://avatars.githubusercontent.com/u/${user.id}` };
	}
}

export const githubAuth = new GithubAuth();
