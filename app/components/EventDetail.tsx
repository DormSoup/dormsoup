"use client";

import { faCalendar, faClock, faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faLocation, faLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";

import { atcb_action } from "add-to-calendar-button";
import IFrameResizer from "iframe-resizer-react";
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { SerializableEvent } from "../EventType";
import { GetEventDetailResponse } from "../api/event-detail/route";
import { clearCurrentEvent } from "../redux/eventDetailSlice";
import { likeEvent } from "../redux/searchSlice";
import { RootState, useAppDispatch } from "../redux/store";

import EventDate from "./EventDate";
import GrayOutIfUnknown from "./GrayOutUnknown";

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
              <EventDate date={event?.date!!} />
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
              ></IFrameResizer>
            </>
          )}
          <BottomBar event={event} eventDetail={eventDetail}></BottomBar>
        </div>
      </div>
    </Transition>
  );

  return modalContent;
}

const BottomBar = ({
  event,
  eventDetail
}: {
  event: SerializableEvent | undefined;
  eventDetail: GetEventDetailResponse | undefined;
}) => {
  const dispatch = useAppDispatch();
  const onAddToCalendarClicked: MouseEventHandler<HTMLDivElement> = (clickEvent) => {
    if (event === undefined) return;
    const dateString = (date: Date) => date.toISOString().split("T")[0];
    const timeString = (date: Date) =>
      date
        .toISOString()
        .split("T")[1]
        .replace(/:\d{2}\.\d{3}Z$/i, "");
    const date = new Date(event.date);
    const endDate = new Date(date);
    endDate.setMinutes(date.getMinutes() + event.duration);
    const config: Parameters<typeof atcb_action>[0] = {
      name: event.title,
      startDate: dateString(date),
      options: ["Microsoft365", "Google", "Apple"],
      location: event.location,
      organizer: `${eventDetail?.fromEmail?.sender.name}|${eventDetail?.fromEmail?.sender.email}`,
      timeZone: "America/New_York",
      listStyle: "dropdown"
    };
    if (!date.toISOString().includes("00:00:00.000Z")) {
      config.startTime = timeString(date);
      config.endTime = timeString(endDate);
    }
    atcb_action(config, clickEvent.target as any as HTMLElement);
  };

  const realEvent = useSelector((state: RootState) =>
    state.search.events.find((e) => e.id === event?.id)
  );

  const onLikeButtonClicked: MouseEventHandler<HTMLDivElement> = (clickEvent) => {
    if (event === undefined) return;
    dispatch(likeEvent(event.id));
  };
  return (
    <div className="flex h-10 flex-none select-none flex-row border-t-2 border-gray-300 text-center align-middle">
      <div
        className="w-1/2 rounded-bl-md border-r-[1px] border-gray-300 py-2 transition-all duration-200 hover:cursor-pointer hover:bg-gray-300 hover:text-logo-red"
        onClick={onLikeButtonClicked}
      >
        {realEvent?.liked ? (
          <span className="text-red-500">
            <FontAwesomeIcon icon={faHeartSolid} /> Unlike
          </span>
        ) : (
          <span>
            <FontAwesomeIcon icon={faHeart} className="" /> Like
          </span>
        )}
      </div>
      <div
        className="w-1/2 rounded-br-md border-l-[1px] border-gray-300 py-2 hover:cursor-pointer hover:bg-gray-300 hover:text-logo-red"
        onClick={onAddToCalendarClicked}
      >
        <FontAwesomeIcon icon={faCalendar} /> Add to Calendar
      </div>
    </div>
  );
};

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
