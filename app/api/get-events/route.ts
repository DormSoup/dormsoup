import { NextResponse } from "next/server";
import { prisma } from "../db";


async function getAllEventsRaw(since: Date, until: Date, order: "asc" | "desc") {
  return await prisma.event.findMany({
    where: { date: { gte: since, lte: until } },
    orderBy: { date: order },
    select: {
      id: true,
      source: true,
      title: true,
      organizer: true,
      date: true,
      location: true,
      duration: true,
      fromEmailId: true,
      text: true,
      fromEmail: {
        select: { senderEmail: true, receivedAt: true }
      },
      tags: {
        select: { name: true }
      }
    }
  });
}

async function getAllEvents(since: Date, until: Date, order: "asc" | "desc") {
  const events: (Omit<Awaited<ReturnType<typeof getAllEventsRaw>>[0], "fromEmail" | "text"> & {
    recievedDate: Date | undefined;
    details: string;
    contact_email: string | undefined;
  })[] = (await getAllEventsRaw(since, until, order)).map((event) => {
    event.fromEmail?.receivedAt.setHours(event.fromEmail?.receivedAt.getHours())
    const { fromEmail: _, text: __, ...ret } = {
      ...event,
      details: event.text,
      contact_email: event.fromEmail?.senderEmail,
      recievedDate: event.fromEmail?.receivedAt,
    };
    return ret;
  });
  return events;
}

interface RateLimitRequestData {
    count: number;
    firstRequest: number;
}

const map = new Map<string, RateLimitRequestData>();
const limit: number = 10
const interval: number = 60_000

export async function GET(req: Request) {
   const ip: string | undefined =
        (req.headers.get('x-forwarded-for') as string | undefined) ||
        (req.headers.get('x-real-ip') as string | undefined);
  const key = (ip ?? '') as string;

  if (!map.has(key)) {
      map.set(key, { count: 0, firstRequest: Date.now() });
  }
  const data = map.get(key)!;
  if (Date.now() - data.firstRequest > interval) {
      // Reset the count every interval
      data.count = 0;
      data.firstRequest = Date.now();
  }
  data.count += 1;
  if (data.count > limit) {
      return NextResponse.json({ message: 'Too many requests, please try again later.'}, { status: 429 });
  }
  map.set(key, data);

  // Retrieve the token from the Authorization header
  const authorizationHeader = req.headers.get('Authorization');

  if (!authorizationHeader) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authorization header missing' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  // Expecting a Bearer token format: "Bearer <token>"
  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Token missing from Authorization header' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const isValidToken =  token === process.env.API_KEY;

    if (!isValidToken) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid or expired token' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // If the token is valid, proceed.
    const params = new URL(req.url).searchParams;
    console.log("/get-events: ", params);
    const since = new Date(params.get("since") ?? new Date(1900, 1, 1));
    const until = new Date(params.get("until") ?? new Date(2100, 1, 1));
    const order = params.get("order") ?? "asc";
    if (order !== "asc" && order !== "desc") return NextResponse.error();
    const foundEvents = await getAllEvents(since, until, order)
    return NextResponse.json({events: foundEvents, count: foundEvents.length});

  } catch (error) {
    console.error('Token validation error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication failed' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};