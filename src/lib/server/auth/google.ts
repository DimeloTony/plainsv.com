import { AuthSession, type AuthUserProfile } from "./session.js";

/** Authenticate user using google
 * 1. From `api/auth/google/+server.ts`: save a random state and code verifier to the `google_oauth_state` and `google_code_verifier` cookies and redirect the user to google.com using createAuthorizationURL
 * 2. From `api/auth/google/callback/+server.ts`: check the state from the url matches the cookie, then exchange the code from the url and the code verifier cookie for tokens using validateAuthorizationCode
 * 3. From `api/auth/google/callback/+server.ts`: read the user's id, verified email, and avatar from the ID token claims using getUser, then find or create the user in the database
 * 4. From `api/auth/google/callback/+server.ts`: create a session using generateSessionToken and createSession, then save its token to the `session` cookie using setSessionTokenCookie
 * 5. From `hooks.server.ts`: run hook before the main handle with `sequence`, which loads the session and user from the `session` cookie on every request using validateSessionToken
 * 6. From `api/auth/signout/+server.ts`: sign the user out using invalidateSession and deleteSessionTokenCookie */
class GoogleAuth extends AuthSession {
	/** Build the Google sign in URL from the state, code verifier, and scopes */
	createAuthorizationURL(state: string, codeVerifier: string, scopes: string[], redirectURI: string) {
		const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
		url.searchParams.set("state", state);
		// Google requires the redirect URI, and it must match one set in the OAuth client.
		url.searchParams.set("redirect_uri", redirectURI);
		// If scopes were given: add them, space separated.
		if (scopes.length > 0) url.searchParams.set("scope", scopes.join(" "));
		// PKCE: Google gets the hashed verifier now and the plain one on the token exchange.
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", this.createCodeChallenge(codeVerifier));
		return url;
	}

	/** Exchange the callback code and code verifier for tokens */
	async validateAuthorizationCode(code: string, codeVerifier: string, redirectURI: string) {
		const res = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code,
				code_verifier: codeVerifier,
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: redirectURI,
			}),
		});
		const data: { access_token: string; expires_in: number; scope: string; id_token: string } | { error: string; error_description?: string } = await res.json();
		// If the exchange failed: throw the error.
		if ("error" in data) throw new Error(data.error_description ?? data.error);
		return {
			accessToken: data.access_token,
			accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
			scopes: data.scope.split(" "),
			// The ID token came straight from Google over HTTPS, so its claims can be read without checking the signature.
			claims: JSON.parse(Buffer.from(data.id_token.split(".")[1], "base64url").toString()) as GoogleClaims,
		};
	}

	/** Read the user's id, verified email, and avatar from the ID token claims, without another request */
	async getUser(tokens: { claims: GoogleClaims }): Promise<AuthUserProfile> {
		const { claims } = tokens;
		// If the email is not verified: throw an error.
		if (!claims.email_verified) throw new Error("Your Google email must be verified to continue.");
		return { id: claims.sub, email: claims.email, image: claims.picture };
	}
}

export const googleAuth = new GoogleAuth();

/** Claims read from the Google ID token with the `openid`, `profile`, and `email` scopes */
export interface GoogleClaims {
	/** Google user id */
	sub: string;
	/** User email */
	email: string;
	/** Whether Google verified the email */
	email_verified: boolean;
	/** Avatar URL */
	picture: string;
	/** Full name */
	name: string;
}
