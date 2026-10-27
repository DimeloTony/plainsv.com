import { defineEnvVars } from "@sveltejs/kit/env";
export const variables = defineEnvVars({
    DOMAIN_URL: { },
    MONGODB_URI: { },
    DATABASE_URL: { },
    GITHUB_CLIENT_ID: { },
    GITHUB_CLIENT_SECRET: { },
    GITHUB_CLASSIC_TOKEN: { },
    GOOGLE_CLIENT_ID: { },
    GOOGLE_CLIENT_SECRET: { }
});