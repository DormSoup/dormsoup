import { getAppServerSession } from "@/app/auth";

import { NextResponse } from "next/server";

import { prisma } from "../db";

async function toggleSubscribe(name: string, email: string) {
  console.log(`${name} ${email} subscribes`);
  const user = await prisma.emailSender.findUnique({
    where: { email },
    select: { subscribed: true }
  });
  if (user === null) {
    await prisma.emailSender.create({
      data: {
        name,
        email,
        subscribed: true
      }
    });
    console.log(`Created user ${name} (${email})`);
    return { subscribed: true };
  }
  if (user.subscribed) {
    // Unsubscribe
    await prisma.emailSender.update({
      where: { email },
      data: { subscribed: false }
    });
    console.log(`Unsubscribed ${name} (${email})`);
    return { subscribed: false };
  } else {
    await prisma.emailSender.update({
      where: { email },
      data: { subscribed: true }
    });
    console.log(`Subscribed ${name} (${email})`);
    return { subscribed: true };
  }
}

async function getSubscribed(name: string, email: string) {
  const user = await prisma.emailSender.findUnique({
    where: { email },
    select: { subscribed: true }
  });
  if (user === null) {
    return { subscribed: false };
  }
  return { subscribed: user.subscribed };
}

export type ToggleSubscribeResponse = Awaited<ReturnType<typeof toggleSubscribe>>;

export async function POST(request: Request) {
  const session = await getAppServerSession(request);
  if (!session) return NextResponse.json("access denied", { status: 403 });
  return NextResponse.json(await toggleSubscribe(session.user?.name!!, session.user?.email!!));
}

export async function GET(request: Request) {
  const session = await getAppServerSession(request);
  if (!session) return NextResponse.json("access denied", { status: 403 });
  return NextResponse.json(await getSubscribed(session.user?.name!!, session.user?.email!!));
}
