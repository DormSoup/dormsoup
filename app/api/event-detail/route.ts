import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { getAppServerSession } from "../../auth";
import { prisma } from "../db";

async function getEventDetail(id: number) {
  return await prisma.event.findUnique({
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
}

export type GetEventDetailResponse = Awaited<ReturnType<typeof getEventDetail>>;

export async function GET(request: Request) {
  const session = await getAppServerSession();
  if (!session) return NextResponse.json("access denied", { status: 403 });

  const params = new URL(request.url).searchParams;
  console.log("/event-detail: ", params);
  const id = parseInt(params.get("id") ?? "0");
  return NextResponse.json(await getEventDetail(id));
}
