"use client";

import { Event } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCalendar, faUser, faClock } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import EventDetail from "./EventDetail";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import { RootState } from "./store";

import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "./modalSlice";

const DATE_OPTIONS: DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
const LLM_UNKNOWN_VALUE = "unknown";
const DISPLAY_UNKNOWN_VALUE = "Unknown";

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const dispatch = useDispatch();

  return (
    <div
      key={`${event.id}`}
      className="flex h-[12rem] w-[13rem] cursor-pointer flex-col rounded-md border-2 border-gray-300 bg-white hover:border-gray-600"
      onClick={() => dispatch(openModal())}
    >
      <div className="line-clamp-3 px-2 pt-2 text-lg font-extrabold">{event.title}</div>
      <div className="grow" />
      <div className="flex-none px-2 pt-1">
        <FontAwesomeIcon icon={faClock} /> &nbsp;{" "}
        {event.date.toLocaleDateString(undefined, DATE_OPTIONS)}
      </div>
      <div>
        {isOpen && (
          <EventDetail onClose={() => dispatch(closeModal())} title="Event Details">
            Hello
          </EventDetail>
        )}
      </div>

      <div className="truncate px-2 pt-1">
        <FontAwesomeIcon icon={faLocationDot} /> &nbsp;{" "}
        {event.location === LLM_UNKNOWN_VALUE ? (
          <span className=" text-gray-500"> {DISPLAY_UNKNOWN_VALUE} </span>
        ) : (
          event.location
        )}
      </div>
      <div className="truncate px-2 pb-1">
        <FontAwesomeIcon icon={faUser} /> &nbsp;{" "}
        {event.organizer === LLM_UNKNOWN_VALUE ? (
          <span className=" text-gray-500"> {DISPLAY_UNKNOWN_VALUE} </span>
        ) : (
          event.organizer
        )}
      </div>
      {/* </div> */}
      {/* <ContentPreview html={event.fromEmail?.body} /> */}

      {/* <div className="flex flex-row border-t border-gray-300">
              <div className="grow rounded-bl-md py-2 text-center text-sm hover:bg-gray-200">
                <FontAwesomeIcon icon={faHeart} size="xl" className="text-red-500" /> &nbsp; Add to
                my events
              </div>
              <div className="flex-none border-l border-gray-300" />
              <div className="grow rounded-br-md py-2 text-center text-sm hover:bg-gray-200">
                <FontAwesomeIcon icon={faCalendar} size="xl" /> &nbsp; Add to calendar
              </div>
            </div> */}
    </div>
  );
}
