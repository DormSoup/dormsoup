"use client";

import { faClock, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event } from "@prisma/client";

import { useEffect, useRef } from "react";

import GrayOutIfUnknown from "./GrayOutUnknown";
import { setCurrentEvent } from "./redux/eventDetailSlice";
import { useAppDispatch } from "./redux/store";

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

type Props = {
  event: Omit<Event, "text">;
};

export default function EventCard({ event }: Props) {
  const dispatch = useAppDispatch();
  const dateRef = useRef<HTMLTableDataCellElement>(null);

  useEffect(() => {
    if (dateRef.current !== null)
      dateRef.current.innerText = event.date.toLocaleDateString(undefined, DATE_OPTIONS);
  }, [event]);

  return (
    <div
      className="flex h-[12rem] cursor-pointer flex-col rounded-md border-2 border-gray-300 bg-white hover:border-gray-600"
      onClick={() => dispatch(setCurrentEvent({ ...event, date: event.date.toISOString() }))}
    >
      <div className="line-clamp-3 px-2 pt-2 text-lg font-extrabold">{event.title}</div>
      <div className="grow" />
      <div className="px-1 text-sm">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-5"></col>
            <col></col>
          </colgroup>
          {/* prettier-ignore */}
          <tbody>
            <tr>
              <td className="text-center"><FontAwesomeIcon icon={faClock} /></td>
              <td ref={dateRef}></td>
            </tr>
            <tr>
              <td className="text-center"><FontAwesomeIcon icon={faLocationDot} /></td>
              <td><GrayOutIfUnknown inline={false} content={event.location} /></td>
            </tr>
            <tr>
              <td className="text-center"><FontAwesomeIcon icon={faUser} /></td>
              <td><GrayOutIfUnknown inline={false} content={event.organizer} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
