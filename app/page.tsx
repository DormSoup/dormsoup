import { headers } from "next/headers";
import Link from "next/link";

import { getAppServerSession } from "./auth";
import CompactEventList from "./components/CompactEventList";
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
    <main className="flex flex-col items-center">
      {/* <TagsPanel /> */}
      <div className="w-full">
        {session === null ? (
          <div className="mx-auto mt-8 max-w-3xl space-y-2 rounded-xl bg-white p-6 shadow-2xl">
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
          <div className="mx-auto flex flex-row items-start gap-8">
            <div className="pl-auto hidden max-w-sm lg:block">
              <TagsPanel />
            </div>
            <CompactEventList />
          </div>
        )}
      </div>
      <EventDetail />
    </main>
  );
}
