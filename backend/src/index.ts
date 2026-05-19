import { serve } from "@hono/node-server";
import { Hono } from "hono";

import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { auth } from "./auth.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { GetGroupRequestSchema, GetGroupResponse } from "@family-app/types";
import { db } from "./db/database.js";
import { group } from "./db/schema.js";

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
app.get("/api/group/:groupId", async (c) => {
  const groupId = Number(c.req.param("groupId"));

  const groupData = await db.select().from(group).where(eq(group.id, groupId));

  if (groupData.length === 0) {
    return c.json({ error: "Group not found" }, 404);
  }

  return c.json({
    name: groupData[0].name,
    users: [],
  } satisfies GetGroupResponse);
});
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
