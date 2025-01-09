"use client";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

import { Session } from "../api/auth/session/route";
import { getAppClientSession } from "../authClient";
import { setSearchKeyword } from "../redux/searchSlice";
import { useAppDispatch } from "../redux/store";

export default function NavBar() {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getAppClientSession().then(setSession);
  }, []);

  const onSignInClicked = () => {
    if (session === undefined) return;
    if (session === null) window.location.href = "/api/auth/sign-in";
    else window.location.href = "/api/auth/sign-out";
  };

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchKeyword(event.target.value.trim().toLowerCase()));
  };

  return (
    <>
      <div className="fixed top-0 z-30 flex h-14 w-full flex-row items-center gap-1 border-b-2 border-gray-300 bg-white px-4 py-2 text-black">
        <Link className="w-32 flex-none" href="/">
          <div className="relative h-8 w-32">
            <Image src="/logo.svg" alt="DormSoup Logo" fill className="object-contain" />
          </div>
        </Link>
        <div className="relative mx-4 grow max-sm:focus-within:fixed max-sm:focus-within:mx-auto max-sm:focus-within:w-[calc(100%-2rem)]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={onSearch}
              />
            </div>
            {session && (
              <Link
                href="/friends"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Friends
              </Link>
            )}
            <button
              onClick={onSignInClicked}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {session === undefined
                ? "Loading..."
                : session === null
                ? "Sign in"
                : "Sign out"}
            </button>
          </div>
        </div>
        <div>
          <a href="/about" className="mr-0 md:mr-4">
            About
          </a>
          {/* <a href="mailto:dormsoup@mit.edu" className="ml-4 mr-0 md:mr-4">
            Contact&nbsp;Us
          </a> */}
        </div>
      </div>
    </>
  );
}
