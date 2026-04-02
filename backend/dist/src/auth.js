import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/database.js";
export const auth = betterAuth({
    basePath: "/api/auth",
    database: drizzleAdapter(db, {
        provider: "sqlite", // or "pg" or "mysql"
    }),
    emailAndPassword: {
        enabled: true,
    },
});
