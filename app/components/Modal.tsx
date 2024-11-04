"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

import { MouseEventHandler, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { clearModal } from "../redux/modalSlice";
import { RootState, useAppDispatch } from "../redux/store";

import EditEventModal from "./EditEventModal";
import EventDetail from "./EventDetail";
import { FilterPanel } from "./EventTagsBar";
import Likes from "./Likes";

export default function Modal() {
  const modal = useSelector((state: RootState) => state.modal.modal);
  const dispatch = useAppDispatch();
  const show = modal !== undefined;
  const fullWidth = show && modal.type === "event-detail";

  const children =
    modal === undefined ? null : modal.type === "event-detail" ? (
      <EventDetail event={modal.event} />
    ) : modal.type === "edit-event" ? (
      <EditEventModal event={modal.event} />
    ) : (
      <div className="px-4 pb-4">
        <FilterPanel />
      </div>
    );
  const title =
    modal?.type === "event-detail"
      ? modal.event.title
      : modal?.type === "edit-event"
      ? "Edit event"
      : null;

  return (
    <Transition
      show={show}
      className="fixed z-50"
      enter="transition-all duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-all duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={
          "fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center bg-slate-950/50 transition duration-150 ease-in-out " +
          (!show ? "pointer-events-none" : "pointer-events-auto")
        }
        onClick={() => dispatch(clearModal())}
      >
        <div
          className={
            "relative m-auto flex max-h-shorter-screen max-w-2xl flex-col rounded-md bg-white shadow-lg " +
            (fullWidth ? "w-full" : "")
          }
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex-none p-2">
            <div className="flex flex-row">
              <div className="grow text-xl font-extrabold">{title}</div>
              <a
                onClick={() => dispatch(clearModal())}
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
