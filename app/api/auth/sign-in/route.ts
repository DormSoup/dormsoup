import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host");
  return NextResponse.redirect(`${host?.includes("localhost") ? "http" : "https"}://${host}/`);
}
