import { PrismaClient } from "@prisma/client";

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

export type Response = Awaited<ReturnType<typeof getEventDetail>>;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  console.log("/event-detail: ", params);
  const id = parseInt(params.get("id") ?? "0");
  return NextResponse.json(await getEventDetail(id));
}
