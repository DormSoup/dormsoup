import { NextResponse } from "next/server";

import { getAppServerSession } from "../../auth";
import { prisma } from "../db";

async function getEventTextSearch(text: string) {
  return await prisma.event.findMany({
    where: { text: { contains: text, mode: "insensitive" } },
    select: { id: true }
  });
}

export type GetEventTextSearchResponse = Awaited<ReturnType<typeof getEventTextSearch>>;

export async function GET(request: Request) {
  const session = await getAppServerSession(request);
  if (!session) return NextResponse.json("access denied", { status: 403 });

  const params = new URL(request.url).searchParams;
  return NextResponse.json(await getEventTextSearch(params.get("keyword") ?? ""));
}
