/** A signed-in user as auth sees it */
export interface AuthUser {
	/** User id */
	id: string;
	/** Verified email from the auth provider */
	email: string;
	/** Avatar URL */
	image: string;
}

/** Profile returned by an OAuth provider after sign in */
export interface AuthProfile {
	/** Verified email, used to match an existing user */
	email: string;
	/** Avatar URL from the provider */
	image: string;
}

/** A login session as auth sees it */
export interface AuthSession {
	/** SHA-256 hash of the session cookie token */
	id: string;
	/** Id of the user who owns the session */
	userId: string;
	/** When the session stops being valid */
	expiresAt: Date;
}

/** Database calls auth needs, so any database can back it */
export interface AuthDb {
	/** Saves a new session */
	createSession(session: AuthSession): Promise<void>;
	/** Finds a session by id, or returns `null` */
	findSession(id: string): Promise<AuthSession | null>;
	/** Moves a session's expiry date */
	updateSessionExpiry(id: string, expiresAt: Date): Promise<void>;
	/** Deletes a session by id */
	deleteSession(id: string): Promise<void>;
	/** Finds a user by id, or returns `null` */
	findUser(id: string): Promise<AuthUser | null>;
	/** Finds the user with the profile's email and updates it, or creates one */
	upsertUser(profile: AuthProfile): Promise<AuthUser>;
}

/** Access token returned by an OAuth provider */
export interface AuthProviderToken {
	/** Access token for the provider's API */
	value: string;
	/** Scopes the user granted */
	scopes: string[];
	/** When the token expires, if the provider says */
	expiresAt?: Date;
}

/** Result of exchanging a callback code, with an error message or the token and profile */
export type AuthProviderResult = { error: true; data: string } | { error: false; data: { token: AuthProviderToken; user: AuthProfile & { id: string } } };

/** OAuth provider steps, so the sign in and callback routes work with any provider */
export interface AuthProvider {
	/** Provider name, such as `google` */
	name: string;
	/** Builds the provider's sign in URL from the state and PKCE verifier */
	createAuthorizationURL(state: string, codeVerifier: string): URL;
	/** Exchanges the callback code for a token and the user's verified profile */
	validateAuthorizationCode(code: string, codeVerifier: string): Promise<AuthProviderResult>;
}
