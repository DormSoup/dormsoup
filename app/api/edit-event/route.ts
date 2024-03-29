import { getAppServerSession, isAdmin } from "@/app/auth";
import { DataSource } from "@prisma/client";

import { NextResponse } from "next/server";

import { prisma } from "../db";

async function editEvent(
  eventId: number,
  date: Date,
  title: string,
  duration: number,
  location: string /*, tags: string[]*/
) {
  console.log("editEvent: ", eventId, date, title, duration, location /*, tags*/);
  await prisma.event.update({
    where: { id: eventId },
    data: { date, title, duration, location /*, tags*/, source: DataSource.MANUAL_INPUT }
  });
  return { success: true };
}

export type EditEventResponse = Awaited<ReturnType<typeof editEvent>>;

async function allowEdit(eventId: number, userEmail: string): Promise<boolean> {
  if (isAdmin(userEmail)) return true;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { fromEmail: { select: { senderEmail: true } } }
  });
  if (!event) return false;
  return event.fromEmail?.senderEmail === userEmail;
}

export async function POST(request: Request) {
  const session = await getAppServerSession(request);
  if (!session) return NextResponse.json("access denied", { status: 403 }); // TODO: if session user not equal to event sender, reject
  const payload = await request.json();
  const id = parseInt(payload.id!!);
  if (!(await allowEdit(id, session.user.email)))
    return NextResponse.json("access denied", { status: 403 });
  const date = new Date(payload.date!!);
  const title = payload.title!!;
  const duration = parseInt(payload.duration!!);
  const location = payload.location!!;
  // const tags = payload.tags!!;
  await editEvent(id, date, title, duration, location /*, tags*/);
  // return success
  return NextResponse.json({ success: true });
}
