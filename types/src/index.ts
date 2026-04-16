import { z } from "zod";

export type User = { id: number; name: string; email: string };
export type Group = { id: number; name: string };
export type UserGroup = { groupId: number; userId: number };
export type Event = { id: number; groupId: number };

// Example of a schema for a request to get info about a family group

// When the client wants to get info about a group, what is it sending to the server?
export const GetGroupRequestSchema = z.object({
  id: z.number(),
});

// What is the server sending back?
export const GetGroupResponseSchema = z.object({
  name: z.string(),
  users: z.array(z.number()),
});

// Defines a single event
export const CalendarEventItemSchema = z.object({
  id: z.string(),
  time: z.string(),
  title: z.string(),
  location: z.string(),
});

// Create event
export const CreateCalendarEventRequestSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  location: z.string().optional().default(""),
});

// Response to create event. I DONT HAVE IT RESPOND WITH UUID BECAUSE I DONT SEE A REASON TO USE THE UUID LOCALLY
// SUBJECT TO CHANGE
export const CreateCalendarEventResponseSchema = CalendarEventItemSchema;

// Update event
export const UpdateCalendarEventRequestSchema = z.object({
  id: z.string(),
  time: z.string().min(1),
  title: z.string().min(1),
  location: z.string().optional().default(""),
});

// response
export const UpdateCalendarEventResponseSchema = CalendarEventItemSchema;

// Delete event req
export const DeleteCalendarEventRequestSchema = z.object({
  id: z.string(),
});

// Response
export const DeleteCalendarEventResponseSchema = z.object({
  ok: z.literal(true),
});

export const ListCalendarEventsRequestSchema = z.object({
  groupId: z.number(),
});

export const ListCalendarEventsResponseSchema = z.object({
  events: z.array(CalendarEventItemSchema),
});
