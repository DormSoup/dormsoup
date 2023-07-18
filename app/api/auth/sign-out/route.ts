import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  return NextResponse.redirect(`${protocol}://${host}/Shibboleth.sso/Logout?return=${protocol}://${host}/`);
}