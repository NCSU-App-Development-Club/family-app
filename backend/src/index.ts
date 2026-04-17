import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import {
  CreateCalendarEventRequestSchema,
  DeleteCalendarEventRequestSchema,
  UpdateCalendarEventRequestSchema,
} from "@family-app/types";
import { auth } from "./auth.js";
import type {
  CalendarEventItem,
  CreateCalendarEventResponse,
  DeleteCalendarEventResponse,
  GetGroupResponse,
  ListCalendarEventsResponse,
  UpdateCalendarEventResponse,
} from "./types.js";

const db = drizzle(process.env.DB_FILE_NAME!);

const groupIdParamSchema = z.object({
  groupId: z.coerce.number(),
});

const app = new Hono();
// addded because cross-origin calls to backend were being blocked
app.use("/api/*", cors());

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
// - Leave your current family

// NOTE: Comments are very verbose becuase im learning
app.get("/api/group/:groupId", zValidator("param", groupIdParamSchema), (c) => {
  // get the group from the req
  const { groupId } = c.req.valid("param");
  // return the group
  return c.json({
    name: `Group ${groupId}`,
    users: [1, 2, 3],
  } satisfies GetGroupResponse);
});

// Initially had this as an array, switched to a map for O(1) lookups
// Would we prefer this to be an array?
const eventsByGroupId = new Map<number, Map<string, CalendarEventItem>>();

function eventsForGroup(groupId: number): Map<string, CalendarEventItem> {
  let events = eventsByGroupId.get(groupId);
  if (!events) {
    events = new Map<string, CalendarEventItem>();
    eventsByGroupId.set(groupId, events);
  }
  return events;
}

app.get(
  "/api/groups/:groupId/calendar/events",
  zValidator("param", groupIdParamSchema),
  // callback function because it needs to run only when route is called
  (c) => {
    // groupID comes from the route param
    const { groupId } = c.req.valid("param");
    const events = eventsForGroup(groupId);
    return c.json({
      events: Array.from(events.values()),
    } satisfies ListCalendarEventsResponse);
  },
);

app.post(
  "/api/groups/:groupId/calendar/events",
  // validate groupId
  zValidator("param", groupIdParamSchema),
  // validate request json payload
  zValidator("json", CreateCalendarEventRequestSchema),
  (c) => {
    const { groupId } = c.req.valid("param");
    const body = c.req.valid("json");

    const events = eventsForGroup(groupId);
    const row: CalendarEventItem = {
      id: crypto.randomUUID(),
      time: body.time,
      title: body.title,
      location: body.location,
    };

    events.set(row.id, row);

    return c.json(row satisfies CreateCalendarEventResponse);
  },
);

app.patch(
  "/api/groups/:groupId/calendar/events",
  zValidator("param", groupIdParamSchema),
  zValidator("json", UpdateCalendarEventRequestSchema),

  (c) => {
    const { groupId } = c.req.valid("param");
    const body = c.req.valid("json");

    const events = eventsForGroup(groupId);
    if (!events.has(body.id)) {
      return c.json({ message: "Event not found" }, 404);
    }
    const updated: CalendarEventItem = {
      id: body.id,
      time: body.time,
      title: body.title,
      location: body.location,
    };
    events.set(body.id, updated);
    return c.json(updated satisfies UpdateCalendarEventResponse);
  },
);

app.delete(
  "/api/groups/:groupId/calendar/events",
  zValidator("param", groupIdParamSchema),
  zValidator("json", DeleteCalendarEventRequestSchema),
  (c) => {
    const { groupId } = c.req.valid("param");
    const body = c.req.valid("json");
    const events = eventsForGroup(groupId);
    if (!events.has(body.id)) {
      return c.json({ message: "Event not found" }, 404);
    }
    events.delete(body.id);
    return c.json({ ok: true } satisfies DeleteCalendarEventResponse);
  },
);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
