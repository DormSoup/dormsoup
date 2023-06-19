"use client";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session, status } = useSession();

  const accountButton = () => {
    if (status === "unauthenticated") signIn("mit");
    else if (status === "authenticated") signOut();
  };

  return (
    <div className="fixed top-0 flex h-fit w-full flex-row items-center gap-1 border-b-2 border-gray-300 bg-white px-4 py-2 text-black">
      <Link className="flex-none text-3xl" href="/">
        DormSoup
      </Link>
      <div className="relative mx-4 grow">
        <input
          className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 pl-6 pr-4"
          placeholder="Search here"
        ></input>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-2" size="sm" />
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
