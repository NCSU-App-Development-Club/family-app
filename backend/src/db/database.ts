import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle(process.env.DB_FILE_NAME!);

export type User = { id: number; name: string; email: string };
export type Group = { id: number; name: string };
export type UserGroup = { groupId: number; userId: number };
export type Event = { id: number; groupId: number };
