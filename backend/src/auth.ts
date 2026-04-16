import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/database.js";
import * as schema from "./db/schema.js"; // your drizzle schema

export const auth = betterAuth({
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "pg" or "mysql",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
