import { authOptions } from "../../auth";

import { PrismaClient } from "@prisma/client";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function getEventDetail(id: number) {
  const prisma = new PrismaClient();
  await prisma.$connect();

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        fromEmail: {
          select: {
            body: true,
            subject: true,
            modelName: true,
            receivedAt: true,
            sender: true
          }
        }
      }
    });
    return event;
  } finally {
    await prisma.$disconnect();
  }
}

export type GetEventDetailResponse = Awaited<ReturnType<typeof getEventDetail>>;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("access denied", { status: 403 });

  const params = new URL(request.url).searchParams;
  console.log("/event-detail: ", params);
  const id = parseInt(params.get("id") ?? "0");
  return NextResponse.json(await getEventDetail(id));
}
