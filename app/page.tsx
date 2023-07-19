import { headers } from "next/headers";
import Link from "next/link";

import { getAppServerSession } from "./auth";
import EventDetail from "./components/EventDetail";
import EventList from "./components/EventList";
import { TagsPanel } from "./components/EventTagsBar";

export const dynamic = "force-dynamic";

const DormSoupName = () => (
  <>
    <span className="font-bold">Dorm</span>
    <span className="">Soup</span>
  </>
);

export default async function Home() {
  const session = getAppServerSession();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <TagsPanel />
      <div className="w-full">
        {session === null ? (
          <div className="mt-8 space-y-2 rounded-xl bg-white p-6 shadow-2xl">
            <p>
              Welcome to <DormSoupName />, a campus-wide event catalog platform backed by large
              language models! <DormSoupName /> extracts events from dormspams, tags them, and
              display them cleanly in a uniform format, thus saving everyone&aposs trouble of going
              through hundreds of emails to search for interesting events.
            </p>
            <p>
              To view the events,{" "}
              <span className="font-bold">
                please first verify your identity as an MIT student by clicking{" "}
                <span className=" text-logo-red">Sign In</span>{" "}
              </span>{" "}
              on the upper right corner of the page and authenticate using Touchstone.
            </p>
          </div>
        ) : (
          <>
            <EventList />
          </>
        )}
      </div>
      <EventDetail />
    </main>
  );
}
