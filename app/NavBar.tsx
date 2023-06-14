"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const { data: session, status } = useSession();

  const accountButton = () => {
    if (status === "unauthenticated") signIn("mit");
    else if (status === "authenticated") signOut();
  };

  return (
    <div className="fixed w-full flex h-fit flex-row items-center gap-1 bg-white px-4 py-2 top-0 text-black border-b-2 border-gray-300">
      <Link className="flex-none text-3xl" href="/">
        DormSoup
      </Link>
      <div className="grow relative mx-4">
        <input className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 pl-6 pr-4" placeholder="Search here"></input>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-2" size="sm"/>
      </div>
      <button className="text-md flex-none rounded-lg" onClick={accountButton}>
        {status === "unauthenticated" ? (
          "Sign in"
        ) : status === "authenticated" ? (
          <div className="flex flex-col items-end">
            <span className="text-sm">{session.user?.name}</span>
            <span className="text-xs">{session.user?.email}</span>
          </div>
        ) : (
          "Loading..."
        )}
      </button>
    </div>
  );
}