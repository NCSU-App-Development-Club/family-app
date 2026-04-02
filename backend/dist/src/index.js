import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { auth } from "./auth.js";
const db = drizzle(process.env.DB_FILE_NAME);
const app = new Hono();
app.get("/", (c) => {
    return c.text("Hello Hono!");
});
import { hello, } from "@family-app/types";
// ...
console.log({ hello });
app.get("/api/group/:groupId", 
// zValidator("json", GetGroupRequestSchema),
(c) => {
    // @ts-ignore
    const requestData = c.req.valid("json");
    // put the backend code for the api route here
    return c.json({
        name: "sample name",
        users: [0, 1, 2],
    });
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
serve({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
