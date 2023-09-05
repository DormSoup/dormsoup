import { Event } from "@prisma/client";

export type SerializableEvent = Omit<Event, "date" | "text"> & {
  date: string;
  liked: boolean;
  likes: number;
  editable: boolean;
};
export type SerializableEventWithTags = SerializableEvent & { tags: string[] };
