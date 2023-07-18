"use client";

import { Session } from "./api/auth/session/route";

export async function getAppClientSession(): Promise<Session> {
  const response = await fetch("/api/auth/session");
  return (await response.json()) as Session;
}
