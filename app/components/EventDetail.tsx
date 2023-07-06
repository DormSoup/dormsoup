"use client";

import { faCalendar, faClock, faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLocation, faLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

import IFrameResizer from "iframe-resizer-react";
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { GetEventDetailResponse } from "../api/event-detail/route";
import { clearCurrentEvent } from "../redux/eventDetailSlice";
import { RootState, useAppDispatch } from "../redux/store";

import GrayOutIfUnknown from "./GrayOutUnknown";

import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

const DATE_OPTIONS: DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric", // "7"
  minute: "2-digit", // "00"
  hour12: true, // "PM"
  timeZone: "UTC"
};

export default function EventDetail() {
  const event = useSelector((state: RootState) => state.eventDetail.event);
  const dispatch = useAppDispatch();
  const [eventDetail, setEventDetail] = useState<GetEventDetailResponse | undefined>(undefined);

  const handleCloseClick = (event: React.MouseEvent<Element, MouseEvent>) => {
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
          (event === undefined ? "pointer-events-none" : "pointer-events-auto")
        }
        onClick={handleCloseClick}
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
              <div className="grow text-lg font-extrabold">{event?.title}</div>
              <a
                onClick={handleCloseClick}
                className="block h-6 w-6 flex-none rounded-full text-center hover:cursor-pointer hover:bg-logo-red hover:text-white"
              >
                <FontAwesomeIcon icon={faXmark} />
              </a>
            </div>
          </div>
          <div className="flex flex-none flex-row gap-2 px-2">
            <div>
              <FontAwesomeIcon icon={faClock} />
              {"  "}
              {new Date(event?.date!!).toLocaleDateString("en-US", DATE_OPTIONS)}
            </div>
            <div>
              <FontAwesomeIcon icon={faLocationDot} />
              {"  "}
              <GrayOutIfUnknown inline={true} content={event?.location ?? ""} />
            </div>
          </div>
          {eventDetail === undefined ? (
            <div className="flex-none">Loading...</div>
          ) : (
            <>
              <div className="m-1 flex-none border-b-2 border-gray-300 p-1 text-xs text-gray-500">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-32"></col>
                    <col className="truncate"></col>
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
                        <a
                          className="hover:text-sky-500"
                          href={"mailto:" + eventDetail?.fromEmail?.sender.email}
                        >
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
              <IFrameResizer
                className="p-1"
                srcDoc={prepareEmailBody(eventDetail?.fromEmail?.body)}
                checkOrigin={false}
                scrolling={true}
                // onLoad={(event) => {
                //   const iframe = event.target as HTMLIFrameElement;
                //   if (iframe.contentWindow?.document.body.scrollHeight !== undefined)
                //     iframe.style.height =
                //       iframe.contentWindow.document.body.scrollHeight + 30 + "px";
                // }}
              ></IFrameResizer>
            </>
          )}
          <div className="flex h-10 flex-none flex-row border-t-2 border-gray-300 text-center align-middle">
            <div className="w-1/2 rounded-bl-md border-r-[1px] border-gray-300 py-2 hover:cursor-pointer hover:bg-gray-300">
              <FontAwesomeIcon icon={faHeart} /> Like
            </div>
            <div className="w-1/2 rounded-br-md border-l-[1px] border-gray-300 py-2 hover:cursor-pointer hover:bg-gray-300">
              <FontAwesomeIcon icon={faCalendar} /> Add to Calendar
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );

  return modalContent;
}

/**
 * Inserts the iframe resizer script into the HTML body,
 * and ensure that all links within the iframe will open a new tab.
 *
 * @param body The email body HTML.
 * @returns
 */
function prepareEmailBody(body: string | undefined): string | undefined {
  if (body === undefined) return undefined;
  const emailDocument = document.createElement("html");
  emailDocument.innerHTML = body;
  const scriptTag = document.createElement("script");
  scriptTag.src =
    "https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.6/js/iframeResizer.contentWindow.min.js";
  let hasHead = false;
  for (let child of emailDocument.children) {
    if (child.tagName === "HEAD") {
      child.insertBefore(scriptTag, child.firstChild);
      hasHead = true;
      break;
    }
  }
  if (!hasHead) emailDocument.insertBefore(scriptTag, emailDocument.firstChild);

  for (let a of emailDocument.getElementsByTagName("a")) a.setAttribute("target", "_blank");

  return emailDocument.outerHTML;
}
