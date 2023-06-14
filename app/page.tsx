import { getServerSession } from "next-auth";

import { authOptions } from "./auth";
import EventList from "./EventList";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between`}>
      <div className="w-full">
        {session === null ? "Welcome to Dormsoup! Sign in to view all the contents" : <EventList />}
      </div>
    </main>
  );
}
