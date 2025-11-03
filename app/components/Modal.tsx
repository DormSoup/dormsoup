"use client";

import { faCheck, faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { clearModal } from "../redux/modalSlice";
import { RootState, useAppDispatch } from "../redux/store";

import Comments from "./Comments";
import EditEventModal from "./EditEventModal";
import EventDetail from "./EventDetail";
import { FilterPanel } from "./EventTagsBar";

export default function Modal() {
  const modal = useSelector((state: RootState) => state.modal.modal);
  const dispatch = useAppDispatch();
  const show = modal !== undefined;
  const fullWidth = show && modal.type === "event-detail";
  const [showComments, setShowComments] = useState(true);

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      // cleanup timeout on unmount
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Close the comments modal if the modal type changes to "edit-event"
    if (modal?.type === "edit-event") {
      setShowComments(false);
    }
  }, [modal?.type]);

  const children =
    modal === undefined ? null : modal.type === "event-detail" ? (
      <EventDetail event={modal.event} setShowComments={setShowComments} />
    ) : modal.type === "edit-event" ? (
      <EditEventModal event={modal.event} />
    ) : (
      <FilterPanel />
    );

  const title =
    modal?.type === "event-detail"
      ? modal.event.title
      : modal?.type === "edit-event"
      ? "Edit event"
      : null;

  return (
    <>
      {/* Main Modals Container */}
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
            "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 transition duration-150 ease-in-out " +
            (!show ? "pointer-events-none" : "pointer-events-auto")
          }
          onClick={() => dispatch(clearModal())}
        >
          {/* Both Modals */}
          <div
            className={
              `relative m-4 flex max-h-[80vh] max-w-7xl flex-col items-center ` +
              (showComments ? "md:flex-row md:space-x-4" : "md:items-center md:justify-center")
            }
            onClick={(event) => event.stopPropagation()}
          >
            {/* Event Modal */}
            <div
              className={
                `relative flex flex-col rounded-md bg-white shadow-lg ` +
                (modal?.type === "edit-event"
                  ? "max-h-[70vh]"
                  : "max-h-[80vh] w-[90%]" + (!showComments ? " md:mx-auto" : ""))
              }
            >
              <div className="flex-none p-2">
                <div className="flex flex-row">
                  <div className="grow text-xl font-extrabold">{title}</div>
                  <div className="flex flex-row">
                    <button
                      onClick={() => {
                        const id = modal?.type === "event-detail" ? modal.event.id : "";
                        const link = id
                          ? `${window.location.origin}/?eventId=${encodeURIComponent(
                              JSON.stringify(id)
                            )}`
                          : window.location.origin;

                        navigator.clipboard.writeText(link).then(() => {
                          // show the 'copied' state
                          setCopied(true);
                          // clear any previous timeout
                          if (copyTimeoutRef.current) {
                            window.clearTimeout(copyTimeoutRef.current);
                          }
                          // revert after 2s
                          copyTimeoutRef.current = window.setTimeout(() => {
                            setCopied(false);
                            copyTimeoutRef.current = null;
                          }, 2000);
                        }).catch;
                      }}
                      className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm transition-colors duration-150 hover:cursor-pointer hover:bg-logo-red hover:text-white"
                      aria-label="Copy link to this event"
                    >
                      <span
                        className={`inline-flex items-center transition-transform duration-150 ${
                          copied ? "scale-95" : ""
                        }`}
                      >
                        <FontAwesomeIcon icon={copied ? faCheck : faLink} />
                      </span>
                      <span className="ml-1 text-sm">
                        {copied ? "Copied!" : <span className="hidden md:inline">Copy Link</span>}
                      </span>
                    </button>
                    <a
                      onClick={() => dispatch(clearModal())}
                      className="block h-6 w-6 flex-none rounded-full text-center hover:cursor-pointer hover:bg-logo-red hover:text-white"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </a>
                  </div>
                </div>
              </div>
              {children}
            </div>

            {/* Comments Modal */}
            {showComments && (
              <div
                className={`absolute ${
                  showComments ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" : ""
                } z-50 flex h-[80vh] w-[90%] flex-col rounded-md bg-white shadow-lg md:relative md:left-0 md:top-0 md:h-[80vh] md:w-[40%] md:transform-none`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-gray-300 p-2">
                  <h2 className="text-xl font-bold">Comments</h2>
                  <button
                    onClick={() => setShowComments(false)}
                    className="block h-6 w-6 flex-none rounded-full text-center hover:cursor-pointer hover:bg-logo-red hover:text-white"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                {/* Scrollable Comments Section */}
                <div className="flex-1 overflow-y-auto px-2 pt-2">
                  {modal?.type === "event-detail" && modal.event && (
                    <Comments event={modal.event} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </>
  );
}
