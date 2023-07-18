import { getAppServerSession } from "@/app/auth";

import { NextResponse } from "next/server";

import { prisma } from "../db";

async function likeEvent(eventId: number, name: string, email: string) {
  console.log(`Like ${eventId} by ${name} (${email})`);
  const user = await prisma.emailSender.findUnique({
    where: { email },
    select: { likes: { select: { id: true } } }
  });
  if (user === null) {
    await prisma.emailSender.create({
      data: {
        name,
        email,
        likes: { connect: { id: eventId } }
      }
    });
    console.log(`Created user ${name} (${email})`);
    return { liked: true };
  }
  if (user.likes.some((event) => event.id === eventId)) {
    // Unlike
    await prisma.emailSender.update({
      where: { email },
      data: { likes: { disconnect: { id: eventId } } }
    });
    console.log(`Unlike ${name} (${email})`);
    return { liked: false };
  } else {
    await prisma.emailSender.update({
      where: { email },
      data: { likes: { connect: { id: eventId } } }
    });
    console.log(`Like ${name} (${email})`);
    return { liked: true };
  }
}

export type LikeEventResponse = Awaited<ReturnType<typeof likeEvent>>;

export async function POST(request: Request) {
  const session = await getAppServerSession(request);
  if (!session) return NextResponse.json("access denied", { status: 403 });
  const payload = await request.json();
  const id = parseInt(payload.id!!);
  return NextResponse.json(await likeEvent(id, session.user?.name!!, session.user?.email!!));
}
