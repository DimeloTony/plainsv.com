import type { AuthProvider } from "#lib/server/auth/types.js";

/** GitHub OAuth app settings from `.env` */
const config = {
	clientId: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	redirectURI: `${process.env.DOMAIN_URL}/api/auth/github/callback`,
	scopes: ["user:email"],
};

/** GitHub sign in; the `auth-github` item installs this file as `src/lib/server/auth/provider.ts` */
export const authProvider: AuthProvider = {
	name: "github",
	// GitHub OAuth apps do not use PKCE, so the verifier is ignored.
	createAuthorizationURL(state: string) {
		const url = new URL("https://github.com/login/oauth/authorize");
		url.searchParams.set("response_type", "code");
		url.searchParams.set("client_id", config.clientId);
		url.searchParams.set("redirect_uri", config.redirectURI);
		url.searchParams.set("state", state);
		url.searchParams.set("scope", config.scopes.join(" "));
		return url;
	},
	async validateAuthorizationCode(code: string) {
		try {
			// Exchange the code for an access token
			const tokenReq = await fetch("https://github.com/login/oauth/access_token", {
				method: "POST",
				headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, code: code, redirect_uri: config.redirectURI }),
			});
			const tokens: GithubTokensRes = await tokenReq.json();
			// GitHub answers failed exchanges with status 200, so check the body for an error
			if ("error" in tokens) return { error: true, data: tokens.error_description ?? tokens.error };
			const accessToken = tokens.access_token;
			const scopes = tokens.scope.split(",");
			const userInfoReq = await fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${accessToken}` } });
			const userInfo: GithubUserInfoRes = await userInfoReq.json();
			// Get github emails
			const emailsReq = await fetch("https://api.github.com/user/emails", { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" } });
			const emails: GithubEmailsData = await emailsReq.json();
			const findPrimaryEmailRes = emails.find((data) => data.primary && data.verified);

			// If no primary and verified email was found: return error
			if (!findPrimaryEmailRes) return { error: true, data: "Your email must be verified to continue." };

			return {
				error: false,
				data: {
					token: { value: accessToken, scopes, expiresAt: undefined },
					user: { id: userInfo.id.toString(), email: findPrimaryEmailRes.email, image: `https://avatars.githubusercontent.com/u/${userInfo.id}` },
				},
			};
		} catch (error: any) {
			return { error: true, data: error.message };
		}
	},
};

/** GitHub token exchange response, which is either the tokens or an error */
export type GithubTokensRes =
	| {
			/** Access token for the GitHub API */
			access_token: string;
			/** Comma separated granted scopes */
			scope: string;
			/** Token type, always `bearer` */
			token_type: string;
	  }
	| {
			/** Error code, such as `bad_verification_code` */
			error: string;
			/** Readable error message */
			error_description?: string;
	  };

export interface GithubUserInfoRes {
	id: number;
	login: string;
	avatar_url: string;
}

export type GithubEmailsData = {
	email: string;
	primary: boolean;
	verified: boolean;
}[];
