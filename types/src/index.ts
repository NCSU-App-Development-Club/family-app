import { z, ZodSchema } from "zod";

export type User = { id: number; name: string; email: string };
export type Group = { id: number; name: string };
export type UserGroup = { groupId: number; userId: number };
export type Event = { id: number; groupId: number };

// Example of a schema for a request to get info about a family group

// When the client wants to get info about a group, what is it sending to the server?
export const GetGroupRequestSchema = z.object({
  id: z.number(),
});
export type GetGroupRequest = z.infer<typeof GetGroupRequestSchema>;

// What is the server sending back?
export const GetGroupResponseSchema = z.object({
  name: z.string(),
  users: z.array(z.number()),
});

export type GetGroupResponse = z.infer<typeof GetGroupResponseSchema>;

export const hello = "123";

export const abc = z.string();
