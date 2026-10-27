import { createHash } from "node:crypto";
import type { AuthProvider } from "#lib/server/auth/types.js";

/** Google OAuth app settings from `.env` */
const config = {
	clientId: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	redirectURI: `${process.env.DOMAIN_URL}/api/auth/google/callback`,
	scopes: ["openid", "profile", "email"],
};

/** Google sign in; the `auth-google` item installs this file as `src/lib/server/auth/provider.ts` */
export const authProvider: AuthProvider = {
	name: "google",
	createAuthorizationURL(state: string, codeVerifier: string) {
		// PKCE: Google gets the hashed verifier now and the plain one on the token exchange.
		const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
		const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", config.clientId);
		url.searchParams.set("redirect_uri", config.redirectURI);
		url.searchParams.set("state", state);
		url.searchParams.set("scope", config.scopes.join(" "));
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", codeChallenge);
		return url;
	},
	async validateAuthorizationCode(code: string, codeVerifier: string) {
		try {
			// Exchange the code and PKCE verifier for tokens
			const tokenReq = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					grant_type: "authorization_code",
					code: code,
					code_verifier: codeVerifier,
					client_id: config.clientId,
					client_secret: config.clientSecret,
					redirect_uri: config.redirectURI,
				}),
			});
			const tokens: GoogleTokensRes = await tokenReq.json();
			// If the exchange failed: return error
			if ("error" in tokens) return { error: true, data: tokens.error_description ?? tokens.error };
			// The ID token came straight from Google over HTTPS, so its payload can be read without checking the signature
			const claims: GoogleClaimsRes = JSON.parse(Buffer.from(tokens.id_token.split(".")[1], "base64url").toString());
			const accessToken = tokens.access_token;
			const scopes = tokens.scope.split(" ").map((data) => data.split("/").pop()!);
			const accessTokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);
			// If email is not verified: return error
			if (!claims.email_verified) return { error: true, data: "Your email must be verified to continue." };
			// Return data
			return {
				error: false,
				data: {
					token: { value: accessToken, scopes, expiresAt: accessTokenExpiresAt },
					user: { id: claims.sub, email: claims.email, image: claims.picture },
				},
			};
		} catch (error: any) {
			return { error: true, data: error.message };
		}
	},
};

/** Google token exchange response, which is either the tokens or an error */
export type GoogleTokensRes =
	| {
			/** Access token for Google APIs */
			access_token: string;
			/** Seconds until the access token expires */
			expires_in: number;
			/** Space separated granted scopes */
			scope: string;
			/** JWT with the user claims, present when the `openid` scope is requested */
			id_token: string;
			/** Token type, always `Bearer` */
			token_type: string;
	  }
	| {
			/** Error code, such as `invalid_grant` */
			error: string;
			/** Readable error message */
			error_description?: string;
	  };

export interface GoogleClaimsRes {
	sub: string; // google id
	email: string;
	email_verified: boolean;
	picture: string;
	given_name: string;
	name: string;
}
