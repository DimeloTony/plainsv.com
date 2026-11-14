import { createHash } from "node:crypto";
import type { AuthProvider } from "#lib/server/auth/types.js";

/** Vercel app settings from `.env` */
const config = {
	clientId: process.env.VERCEL_CLIENT_ID,
	clientSecret: process.env.VERCEL_CLIENT_SECRET,
	redirectURI: `${process.env.DOMAIN_URL}/api/auth/vercel/callback`,
	scopes: ["openid", "profile", "email"],
};

/** Vercel sign in; the `auth-vercel` items install this file as `src/lib/server/auth/provider.ts` */
export const authProvider: AuthProvider = {
	name: "vercel",
	createAuthorizationURL(state: string, codeVerifier: string) {
		// PKCE is required: Vercel gets the hashed verifier now and the plain one on the token exchange.
		const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
		const url = new URL("https://vercel.com/oauth/authorize");
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
			// Exchange the code and PKCE verifier for tokens, sending the secret in the body (`client_secret_post`)
			const tokenReq = await fetch("https://api.vercel.com/login/oauth/token", {
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
			const tokens: VercelTokensRes = await tokenReq.json();
			// If the exchange failed: return error
			if ("error" in tokens) return { error: true, data: tokens.error_description ?? tokens.error };
			const accessToken = tokens.access_token;
			const scopes = tokens.scope.split(" ");
			const accessTokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);
			// The ID token has no `email_verified` claim, so read the profile from the UserInfo endpoint instead
			const userInfoReq = await fetch("https://api.vercel.com/login/oauth/userinfo", { headers: { Authorization: `Bearer ${accessToken}` } });
			// If the profile request failed: return error
			if (!userInfoReq.ok) return { error: true, data: "Could not load your Vercel profile." };
			const userInfo: VercelUserInfoRes = await userInfoReq.json();
			// If email is missing or not verified: return error
			if (!userInfo.email || !userInfo.email_verified) return { error: true, data: "Your email must be verified to continue." };
			// Return data
			return {
				error: false,
				data: {
					token: { value: accessToken, scopes, expiresAt: accessTokenExpiresAt },
					// Vercel only sends `picture` when the user has an avatar
					user: { id: userInfo.sub, email: userInfo.email, image: userInfo.picture ?? "" },
				},
			};
		} catch (error: any) {
			return { error: true, data: error.message };
		}
	},
};

/** Vercel token exchange response, which is either the tokens or an error */
export type VercelTokensRes =
	| {
			/** Access token for the Vercel API, valid for one hour */
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

/** Vercel UserInfo response for the `openid`, `profile`, and `email` scopes */
export interface VercelUserInfoRes {
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
