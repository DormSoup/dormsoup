import { headers } from "next/headers";
import Link from "next/link";

interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import { getAppServerSession } from "./auth";
import CompactEventList from "./components/CompactEventList";
import { FilterPanel } from "./components/EventTagsBar";

export const dynamic = "force-dynamic";

const DormSoupName = () => (
  <>
    <span className="font-bold">Dorm</span>
    <span className="">Soup</span>
  </>
);

export default async function Home({
  searchParams
}: PageProps) {
  const params = await searchParams;
  const session = await getAppServerSession();

  return (
    <main className="flex flex-col items-center">
      {/* <TagsPanel /> */}
      <div className="w-full">
        {session === null ? (
          <div className="mx-auto mt-8 max-w-3xl space-y-2 rounded-xl bg-white p-6 shadow-2xl">
            <p>
              Welcome to <DormSoupName />, a campus-wide event catalog platform backed by large
              language models! <DormSoupName /> extracts events from dormspams, tags them, and
              display them cleanly in a uniform format, thus saving everyone&apos;s trouble of going
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
          <div className="mx-auto flex flex-row justify-center gap-4 lg:items-start lg:justify-start">
            <div className="hidden rounded-xl bg-white p-4 shadow-xl lg:fixed lg:block">
              <FilterPanel />
            </div>
            <div className="invisible hidden rounded-xl bg-white p-4 shadow-xl lg:left-0 lg:top-0 lg:block">
              <FilterPanel />
            </div>
            <CompactEventList />
          </div>
        )}
      </div>
    </main>
  );
}
