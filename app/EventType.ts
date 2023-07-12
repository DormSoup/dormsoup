import { Event } from "@prisma/client";

export type SerializableEvent = Omit<Event, "date" | "text"> & { date: string };
export type SerializableEventWithTags = SerializableEvent & { tags: string[] };