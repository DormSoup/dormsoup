import { getAppServerSession } from "@/app/auth";

import { NextResponse } from "next/server";

import { prisma } from "../db";

async function getAllEventsRaw(since: Date, until: Date, order: "asc" | "desc") {
  return await prisma.event.findMany({
    where: { date: { gte: since, lte: until } },
    orderBy: { date: order },
    select: {
      id: true,
      source: true,
      fromEmailId: true,
      title: true,
      organizer: true,
      date: true,
      location: true,
      duration: true,
      tagsProcessedBy: true,
      tags: {
        select: { name: true }
      },
      liked: {
        select: { email: true }
      }
    }
  });
}

async function getAllEvents(since: Date, until: Date, order: "asc" | "desc", email: string) {
  const events: (Omit<Awaited<ReturnType<typeof getAllEventsRaw>>[0], "liked"> & {
    liked: boolean;
    likes: number;
  })[] = (await getAllEventsRaw(since, until, order)).map((event) => {
    return {
      ...event,
      liked: event.liked.some((user) => user.email === email),
      likes: event.liked.length
    };
  });
  return events;
}

export type GetEventsResponse = Awaited<ReturnType<typeof getAllEvents>>;

export async function GET(request: Request) {
  const session = await getAppServerSession(request);
  if (!session) return NextResponse.json("access denied", { status: 403 });

  const params = new URL(request.url).searchParams;
  console.log("/events: ", params);
  const since = new Date(params.get("since") ?? new Date(1900, 1, 1));
  const until = new Date(params.get("until") ?? new Date(2100, 1, 1));
  const order = params.get("order") ?? "asc";
  if (order !== "asc" && order !== "desc") return NextResponse.error();
  return NextResponse.json(await getAllEvents(since, until, order, session.user?.email!!));
}
