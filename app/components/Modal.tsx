"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { clearModal } from "../redux/modalSlice";
import { RootState, useAppDispatch } from "../redux/store";

import EditEventModal from "./EditEventModal";
import EventDetail from "./EventDetail";
import { FilterPanel } from "./EventTagsBar";
import Comments from "./Comments";

export default function Modal() {
  const modal = useSelector((state: RootState) => state.modal.modal);
  const dispatch = useAppDispatch();
  const show = modal !== undefined;
  const fullWidth = show && modal.type === "event-detail";
  const [showComments, setShowComments] = useState(false);

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
              `relative flex max-h-[80vh] max-w-7xl flex-col items-center m-4 ` +
              (showComments
                ? "md:flex-row md:space-x-4"
                : "md:items-center md:justify-center")
            }
            onClick={(event) => event.stopPropagation()}
          >

          {/* Event Modal */}
          <div
            className={
              `relative flex flex-col rounded-md bg-white shadow-lg ` +
              (modal?.type === "edit-event"
                ? "max-h-[70vh]"
                : "max-h-[80vh] w-[90%]" +
                  (!showComments ? " md:mx-auto" : ""))
            }
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


            {/* Comments Modal */}
            {showComments && (
              <div
                className={`absolute ${
                  showComments
                    ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                    : ''
                } flex flex-col w-[90%] z-50 rounded-md bg-white shadow-lg h-[80vh] md:relative md:top-0 md:left-0 md:transform-none md:w-[40%] md:h-[80vh]`}
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
              <div className="flex-1 overflow-y-auto pt-2 px-2">
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
