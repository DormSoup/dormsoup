import { NextResponse } from "next/server";

import { getAppServerSession } from "../../../auth";

export type Session = Awaited<ReturnType<typeof getAppServerSession>>;

export async function GET(request: Request) {
  return NextResponse.json(getAppServerSession(request));
}