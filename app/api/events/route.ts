import { authOptions } from "@/app/auth";
import { PrismaClient } from "@prisma/client";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function getAllEvents(since: Date, until: Date, order: "asc" | "desc") {
  const prisma = new PrismaClient();
  await prisma.$connect();

  try {
    return await prisma.event.findMany({
      where: { date: { gte: since, lte: until } },
      orderBy: { date: order }
    });
  } finally {
    await prisma.$disconnect();
  }
}

export type GetEventsResponse = Awaited<ReturnType<typeof getAllEvents>>;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("access denied", { status: 403 });

  const params = new URL(request.url).searchParams;
  console.log("/events: ", params);
  const since = new Date(params.get("since") ?? new Date(1900, 1, 1));
  const until = new Date(params.get("until") ?? new Date(2100, 1, 1));
  const order = params.get("order") ?? "asc";
  if (order !== "asc" && order !== "desc") return NextResponse.error();
  return NextResponse.json(await getAllEvents(since, until, order));
}
