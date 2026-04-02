import { serve } from "@hono/node-server";
import { Hono } from "hono";

import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { auth } from "./auth.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const db = drizzle(process.env.DB_FILE_NAME!);

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// TODO add the following RESTful apis:
// - Edit an existing calendar event
// - Create a new calendar event
// - Fetch the data for a calendar event
// - Fetch info about your current family group
// - Invite another person to your family group (adds an entry to the groupInvitation table)
// - Accept an invitation to a family group
// - Leave your current family group

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
