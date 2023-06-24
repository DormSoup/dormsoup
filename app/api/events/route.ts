import { PrismaClient } from "@prisma/client";

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

export type Response = Awaited<ReturnType<typeof getAllEvents>>;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const since = new Date(params.get("since") ?? new Date(1900, 1, 1));
  const until = new Date(params.get("until") ?? new Date(2100, 1, 1));
  const order = params.get("order") ?? "asc";
  if (order !== "asc" && order !== "desc") return NextResponse.error();
  return NextResponse.json(await getAllEvents(since, until, order));
}
