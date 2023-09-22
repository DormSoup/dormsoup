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
          <input
            className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 pl-6 pr-4"
            placeholder="Search here"
            onChange={onSearch}
          ></input>
          <span className="absolute left-2 top-[0.125rem] -scale-x-100 font-fa-regular">
            {"\u{f2e5}"}
          </span>
        </div>
        <button className="text-md flex-none rounded-lg" onClick={onSignInClicked}>
          {session === null ? (
            "Sign in"
          ) : session === undefined ? (
            "Loading..."
          ) : (
            <div className="flex flex-col items-end">
              <span className="text-sm">{session?.user?.name}</span>
              <span className="text-xs">{session?.user?.email}</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
}
