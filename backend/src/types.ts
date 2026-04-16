import { z } from "zod";
import {
  CalendarEventItemSchema,
  CreateCalendarEventResponseSchema,
  DeleteCalendarEventResponseSchema,
  GetGroupResponseSchema,
  ListCalendarEventsResponseSchema,
  UpdateCalendarEventResponseSchema,
} from "@family-app/types";

export type CalendarEventItem = z.infer<typeof CalendarEventItemSchema>;
export type CreateCalendarEventResponse = z.infer<
  typeof CreateCalendarEventResponseSchema
>;
export type UpdateCalendarEventResponse = z.infer<
  typeof UpdateCalendarEventResponseSchema
>;
export type DeleteCalendarEventResponse = z.infer<
  typeof DeleteCalendarEventResponseSchema
>;
export type GetGroupResponse = z.infer<typeof GetGroupResponseSchema>;
export type ListCalendarEventsResponse = z.infer<
  typeof ListCalendarEventsResponseSchema
>;
