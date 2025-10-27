import { getAppServerSession, isAdmin } from "@/app/auth";
import { prisma } from "../db";
import { NextResponse } from "next/server";
import { DataSource } from "@prisma/client";

async function getEventRaw(id: number) {
  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      source: true,
      title: true,
      organizer: true,
      date: true,
      location: true,
      duration: true,
      fromEmailId: true,
      tagsProcessedBy: true,
      fromEmail: {
        select: { senderEmail: true, receivedAt: true }
      },
      tags: {
        select: { name: true }
      },
      liked: {
        select: { email: true }
      }
    }
  });
  if (!event){
    return undefined;
  }
  else return event;
}

async function getEvent(id:number, email: string) {
  const event: RawGetEventResponse| undefined = await getEventRaw(id).then((event) => {
    if (event){
    event.fromEmail?.receivedAt.setHours(event.fromEmail?.receivedAt.getHours()-4)
        const { fromEmail: _, ...ret } = {
          ...event,
          recievedDate: event.fromEmail?.receivedAt,
          liked: event.liked.some((user) => user.email === email),
          likes: event.liked.length,
          editable: event.fromEmail?.senderEmail === email || isAdmin(email)
        };
        return ret;
    }
    // time is in UTC, subtracting 4 for ETC time
   return undefined;
  });
  return event;
}

type GetRawEventResponse = {
    id: number;
    source: DataSource;
    title: string;
    organizer: string;
    date: Date;
    location: string;
    duration: number;
    fromEmailId: string;
    tagsProcessedBy: string | null;
    fromEmail: {
        senderEmail: string;
        receivedAt: Date;
    } | null;
    tags: {
        name: string;
    }[];
    liked: {
        email: string;
    }[];
};

export type RawGetEventResponse = (Omit<GetRawEventResponse, "liked" | "fromEmail"> & {
    liked: boolean;
    likes: number;
    editable: boolean;
    recievedDate: Date | undefined;
  });

export type GetEventResponse = Awaited<ReturnType<typeof getEvent>>;

export async function GET(request: Request) {
  const session = await getAppServerSession(request);
  if (!session) return NextResponse.json("access denied", { status: 403 });

  const params = new URL(request.url).searchParams;
  console.log("/event: ", params);
  const rawId = params.get("id");
  if (!rawId){
    throw new Error('No ID!');
  }
  const id = parseInt(rawId);
  return NextResponse.json(await getEvent(id, session.user?.email!!));
}