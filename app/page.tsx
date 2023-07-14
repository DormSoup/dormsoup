import { getServerSession } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

import { getAppServerSession } from "./auth";
import EventDetail from "./components/EventDetail";
import EventList from "./components/EventList";

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
      <div className="w-full">
        {session === null ? (
          <div className="mt-8 space-y-2 rounded-xl bg-white p-6 shadow-2xl">
            <p>
              Welcome to <DormSoupName />, a campus-wide event catalog platform backed by large
              language models! <DormSoupName /> extracts events from dormspams, tags them, and
              display them cleanly in a uniform format, thus saving everyone's trouble of going
              through hundreds of emails to search for interesting events.
            </p>
            <p>
              To view the events,{" "}
              <span className="font-bold">
                please first verify your identity as an MIT student by clicking{" "}
                <span className=" text-logo-red">Sign In</span>{" "}
              </span>{" "}
              on the upper right corner of the page. You will be taken to{" "}
              <Link className="text-cyan-600 underline" href="https://oidc.mit.edu">
                MIT OIDC
              </Link>
              , an official MIT service for authentication. OIDC will only release to us your name
              and email after your explicit approval.
            </p>
            <p>
              Unfortunately, the OIDC server has been unstable recently. Hence if nothing happened
              after clicking Sign In, this means our server has been struggling to communicate with
              the OIDC server and you'll have to try again some time later in the day :(. We are
              planning on migrating to Touchstone some day.
            </p>
          </div>
        ) : (
          <EventList />
        )}
      </div>
      <EventDetail />
    </main>
  );
}
