import { getServerSession } from "next-auth";

import EventDetail from "./EventDetail";
import EventList from "./EventList";
import { authOptions } from "./auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {session === null ? "Welcome to Dormsoup! Sign in to view all the contents" : <EventList />}
      </div>
      <EventDetail />
    </main>
  );
}
