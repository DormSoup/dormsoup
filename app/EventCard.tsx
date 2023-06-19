"use client";

import { faClock, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event } from "@prisma/client";

import { setCurrentEvent } from "./modalSlice";
import { useAppDispatch } from "./store";

import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

const DATE_OPTIONS: DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC"
};
const LLM_UNKNOWN_VALUE = "unknown";
const DISPLAY_UNKNOWN_VALUE = "Unknown";

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div
      className="flex h-[12rem] w-[13rem] cursor-pointer flex-col rounded-md border-2 border-gray-300 bg-white hover:border-gray-600"
      onClick={() => dispatch(setCurrentEvent({ ...event, date: event.date.toISOString() }))}
    >
      <div className="line-clamp-3 px-2 pt-2 text-lg font-extrabold">{event.title}</div>
      <div className="grow" />
      <div className="px-1">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-5"></col>
            <col></col>
          </colgroup>
          {/* prettier-ignore */}
          <tbody>
            <tr>
              <td className="text-center"><FontAwesomeIcon icon={faClock} /></td>
              <td>{event.date.toLocaleDateString("en-US", DATE_OPTIONS)}</td>
            </tr>
            <tr>
              <td className="text-center"><FontAwesomeIcon icon={faLocationDot} /></td>
              <td><GrayedOutIfUnknown content={event.location} /></td>
            </tr>
            <tr>
              <td className="text-center"><FontAwesomeIcon icon={faUser} /></td>
              <td><GrayedOutIfUnknown content={event.organizer} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GrayedOutIfUnknown({ content }: { content: string }) {
  return content.trim() === LLM_UNKNOWN_VALUE ? (
    <div className=" text-gray-500"> {DISPLAY_UNKNOWN_VALUE} </div>
  ) : (
    <div className="truncate"> {content} </div>
  );
}
