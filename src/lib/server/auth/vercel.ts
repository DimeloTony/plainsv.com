import { AuthSession, type AuthUserProfile } from "./session.js";

/** Authenticate user using vercel
 * 1. From `api/auth/vercel/+server.ts`: save a random state and code verifier to the `vercel_oauth_state` and `vercel_code_verifier` cookies and redirect the user to vercel.com using createAuthorizationURL
 * 2. From `api/auth/vercel/callback/+server.ts`: check the state from the url matches the cookie, then exchange the code from the url and the code verifier cookie for an access token using validateAuthorizationCode
 * 3. From `api/auth/vercel/callback/+server.ts`: load the user's id, verified email, and avatar from the UserInfo endpoint using getUser, then find or create the user in the database
 * 4. From `api/auth/vercel/callback/+server.ts`: create a session using generateSessionToken and createSession, then save its token to the `session` cookie using setSessionTokenCookie
 * 5. From `hooks.server.ts`: run hook before the main handle with `sequence`, which loads the session and user from the `session` cookie on every request using validateSessionToken
 * 6. From `api/auth/signout/+server.ts`: sign the user out using invalidateSession and deleteSessionTokenCookie */
class VercelAuth extends AuthSession {
	/** Build the Vercel sign in URL from the state, code verifier, and scopes */
	createAuthorizationURL(state: string, codeVerifier: string, scopes: string[], redirectURI: string) {
		const url = new URL("https://vercel.com/oauth/authorize");
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", process.env.VERCEL_CLIENT_ID);
		url.searchParams.set("state", state);
		// Vercel requires the redirect URI, and it must match one set in the app.
		url.searchParams.set("redirect_uri", redirectURI);
		// If scopes were given: add them, space separated.
		if (scopes.length > 0) url.searchParams.set("scope", scopes.join(" "));
		// PKCE is required: Vercel gets the hashed verifier now and the plain one on the token exchange.
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", this.createCodeChallenge(codeVerifier));
		return url;
	}

	/** Exchange the callback code and code verifier for an access token */
	async validateAuthorizationCode(code: string, codeVerifier: string, redirectURI: string) {
		const res = await fetch("https://api.vercel.com/login/oauth/token", {
			method: "POST",
			headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code,
				code_verifier: codeVerifier,
				client_id: process.env.VERCEL_CLIENT_ID,
				client_secret: process.env.VERCEL_CLIENT_SECRET,
				redirect_uri: redirectURI,
			}),
		});
		const data: { access_token: string; expires_in: number; scope: string } | { error: string; error_description?: string } = await res.json();
		// If the exchange failed: throw the error.
		if ("error" in data) throw new Error(data.error_description ?? data.error);
		return { accessToken: data.access_token, accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000), scopes: data.scope.split(" ") };
	}

	/** Load the user's id, verified email, and avatar; the ID token has no `email_verified` claim, so it comes from the UserInfo endpoint */
	async getUser(tokens: { accessToken: string }): Promise<AuthUserProfile> {
		const res = await fetch("https://api.vercel.com/login/oauth/userinfo", { headers: { Authorization: `Bearer ${tokens.accessToken}` } });
		// If the profile request failed: throw an error.
		if (!res.ok) throw new Error("Could not load your Vercel profile.");
		const userInfo: VercelUserInfo = await res.json();
		// If the email is missing or not verified: throw an error.
		if (!userInfo.email || !userInfo.email_verified) throw new Error("Your Vercel email must be verified to continue.");
		// Vercel only sends `picture` when the user has an avatar.
		return { id: userInfo.sub, email: userInfo.email, image: userInfo.picture ?? "" };
	}
}

export const vercelAuth = new VercelAuth();

/** Vercel UserInfo response for the `openid`, `profile`, and `email` scopes */
export interface VercelUserInfo {
	/** Vercel user id */
	sub: string;
	/** Email, present with the `email` scope */
	email?: string;
	/** Whether Vercel verified the email */
	email_verified?: boolean;
	/** Display name */
	name?: string;
	/** Vercel username */
	preferred_username?: string;
	/** Avatar URL, present only when the user has an avatar */
	picture?: string;
}
