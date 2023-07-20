"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

import { useEffect, useState } from "react";

export type ModalProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Modal({ title, children }: ModalProps) {
  const show = children !== undefined;

  return (
    <Transition
      show={show}
      enter="transition-all duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-all duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={
          "fixed bottom-0 left-0 right-0 top-0 z-50 flex bg-slate-950/50 transition duration-150 ease-in-out " +
          (show ? "pointer-events-none" : "pointer-events-auto")
        }
      >
        <div
          className={
            "relative m-auto flex max-h-shorter-screen min-h-min w-full max-w-2xl flex-col rounded-md bg-white shadow-lg"
          }
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="flex-none p-2">
            <div className="flex flex-row">
              <div className="grow text-lg font-extrabold">{title}</div>
              <a
                className="block h-6 w-6 flex-none rounded-full text-center hover:cursor-pointer hover:bg-logo-red hover:text-white"
              >
                <FontAwesomeIcon icon={faXmark} />
              </a>
            </div>
          </div>
          {children}
        </div>
      </div>
    </Transition>
  );
}
