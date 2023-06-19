"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

import React from "react";
import { useSelector } from "react-redux";

import { clearCurrentEvent } from "./modalSlice";
import { RootState, useAppDispatch } from "./store";

const EventDetail = () => {
  const event = useSelector((state: RootState) => state.modal.event);
  const dispatch = useAppDispatch();

  const handleCloseClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    dispatch(clearCurrentEvent());
  };

  const modalContent = (
    <Transition
      show={event !== undefined}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={
          "pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-50 flex bg-slate-950/50 transition duration-150 ease-in-out"
        }
      >
        <div
          className={
            "relative m-auto flex h-80 w-full max-w-2xl flex-col rounded-md bg-white p-2 shadow-lg " +
            (event === undefined ? "pointer-events-none" : "pointer-events-auto")
          }
        >
          <div className="flex-none text-right">
            <a
              href="#"
              onClick={handleCloseClick}
              className="aspect-square w-5 rounded-full p-1 hover:bg-red-500 hover:text-white"
            >
              <FontAwesomeIcon icon={faXmark} />
            </a>
          </div>
          <div className="grow">{event?.title}</div>
        </div>
      </div>
    </Transition>
  );

  return modalContent;
};

export default EventDetail;
