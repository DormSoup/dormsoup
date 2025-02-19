import { NextResponse } from "next/server";

import { getAppServerSession } from "../../../auth";

export type Session = Awaited<ReturnType<typeof getAppServerSession>>;

export async function GET(request: Request) {
  const session = await getAppServerSession(request);
  return NextResponse.json(session);
}