"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Response as GetEventDetailResponse } from "./api/event-detail/route";
import { clearCurrentEvent } from "./modalSlice";
import { RootState, useAppDispatch } from "./store";

const EventDetail = () => {
  const event = useSelector((state: RootState) => state.modal.event);
  const dispatch = useAppDispatch();
  const [eventDetail, setEventDetail] = useState<GetEventDetailResponse | undefined>(undefined);

  const handleCloseClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();
    dispatch(clearCurrentEvent());
  };

  useEffect(() => {
    setEventDetail(undefined);
    if (event === undefined) return;
    fetch("/api/event-detail?" + new URLSearchParams({ id: event.id.toString() }))
      .then((response) => response.json())
      .then((response: GetEventDetailResponse) => setEventDetail(response));
  }, [event]);

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
          "fixed bottom-0 left-0 right-0 top-0 z-50 flex bg-slate-950/50 transition duration-150 ease-in-out " +
          (event === undefined ? "pointer-events-none" : "pointer-events-auto")
        }
        onClick={handleCloseClick}
      >
        <div
          className="relative m-auto flex max-h-shorter-screen min-h-min w-full max-w-2xl flex-col rounded-md bg-white p-2 shadow-lg"
          onClick={(e) => {}}
        >
          <div className="flex-none">
            <div className="flex flex-row">
              <div className="grow text-lg font-extrabold">{event?.title}</div>
              <a
                href="#"
                onClick={handleCloseClick}
                className="block h-6 w-6 flex-none rounded-full text-center hover:bg-red-500 hover:text-white"
              >
                <FontAwesomeIcon icon={faXmark} />
              </a>
            </div>
          </div>
          {eventDetail === undefined ? (
            <div className="flex-none">Loading...</div>
          ) : (
            <>
              <div className="flex-none text-xs text-gray-500">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-32"></col>
                    <col></col>
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>Original subject: </td>
                      <td>{eventDetail?.fromEmail?.subject}</td>
                    </tr>
                    <tr>
                      <td>From: </td>
                      <td>
                        {eventDetail?.fromEmail?.sender.name} (
                        <a href={"mailto:" + eventDetail?.fromEmail?.sender.email}>
                          {eventDetail?.fromEmail?.sender.email}
                        </a>
                        )
                      </td>
                    </tr>
                    <tr>
                      <td>Processed by: </td>
                      <td>{eventDetail?.fromEmail?.modelName}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <iframe
                srcDoc={eventDetail?.fromEmail?.body}
                onLoad={(event) => {
                  const iframe = event.target as HTMLIFrameElement;
                  if (iframe.contentWindow?.document.body.scrollHeight !== undefined)
                    iframe.style.height =
                      iframe.contentWindow.document.body.scrollHeight + 20 + "px";
                }}
              ></iframe>
            </>
          )}
        </div>
      </div>
    </Transition>
  );

  return modalContent;
};

export default EventDetail;
