import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "../db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        schema,
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ['http://localhost:3001'],
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
});
