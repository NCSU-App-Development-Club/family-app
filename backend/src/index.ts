import { serve } from "@hono/node-server";
import { Hono } from "hono";
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

app.get("/api/group/:groupId", zValidator("param", groupIdParamSchema), (c) => {
  const { groupId } = c.req.valid("param");
  return c.json({
    name: `Group ${groupId}`,
    users: [1, 2, 3],
  } satisfies GetGroupResponse);
});

// in-memory: one list per groupId (swap for Drizzle + event.groupId later)
const eventsByGroupId = new Map<number, CalendarEventItem[]>();

function eventsForGroup(groupId: number): CalendarEventItem[] {
  let list = eventsByGroupId.get(groupId);
  if (!list) {
    list = [];
    eventsByGroupId.set(groupId, list);
  }
  return list;
}

app.get(
  "/api/groups/:groupId/calendar/events",
  zValidator("param", groupIdParamSchema),
  (c) => {
    const { groupId } = c.req.valid("param");
    return c.json({
      events: eventsForGroup(groupId),
    } satisfies ListCalendarEventsResponse);
  },
);

app.post(
  "/api/groups/:groupId/calendar/events",
  zValidator("param", groupIdParamSchema),
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
    events.push(row);
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
    const idx = events.findIndex((e) => e.id === body.id);
    if (idx === -1) {
      return c.json({ message: "Event not found" }, 404);
    }
    const updated: CalendarEventItem = {
      id: body.id,
      time: body.time,
      title: body.title,
      location: body.location,
    };
    events[idx] = updated;
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
    const before = events.length;
    const next = events.filter((e) => e.id !== body.id);
    if (next.length === before) {
      return c.json({ message: "Event not found" }, 404);
    }
    events.length = 0;
    events.push(...next);
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
