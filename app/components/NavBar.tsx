"use client";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent } from "react";

import { setSearchKeyword } from "../redux/searchSlice";
import { useAppDispatch } from "../redux/store";

import { FilterTagsBar } from "./EventTagsBar";

export default function NavBar() {
  let { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  const onSignInClicked = () => {
    if (status === "unauthenticated") signIn("mit");
    else if (status === "authenticated") signOut();
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
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-2 top-2" size="sm" />
        </div>
        <button className="text-md flex-none rounded-lg" onClick={onSignInClicked}>
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
      {status === "authenticated" || true ? (
        <div className="fixed top-14 z-30 min-w-full">
          <FilterTagsBar />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
