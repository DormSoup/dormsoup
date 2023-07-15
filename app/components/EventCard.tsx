"use client";

import { faClock, faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useRef } from "react";

import { SerializableEventWithTags } from "../EventType";
import { setCurrentEvent } from "../redux/eventDetailSlice";
import { likeEvent } from "../redux/searchSlice";
import { useAppDispatch } from "../redux/store";

import TagsBar from "./EventTagsBar";
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

type Props = {
  event: SerializableEventWithTags;
};

export default function EventCard({ event }: Props) {
  const dispatch = useAppDispatch();
  const dateRef = useRef<HTMLTableDataCellElement>(null);

  useEffect(() => {
    if (dateRef.current !== null)
      dateRef.current.innerText = new Date(event.date).toLocaleDateString(undefined, DATE_OPTIONS);
  }, [event]);

  return (
    <div
      className="relative flex h-[12rem] cursor-pointer select-none flex-col rounded-md border-2 border-gray-300 bg-white hover:border-gray-600"
      onClick={() =>
        dispatch(setCurrentEvent({ ...event, date: new Date(event.date).toISOString() }))
      }
    >
      <div className="flex justify-between">
        <div className="scale-125 pl-2 pt-1 text-red-500">
          <FontAwesomeIcon
            icon={event.liked ? faHeartSolid : faHeart}
            onClick={(clickEvent) => {
              dispatch(likeEvent(event.id));
              clickEvent.stopPropagation();
            }}
          />
          &nbsp; {event.likes}
        </div>
        <TagsBar tags={event.tags.map((tag) => tag)} />
      </div>
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
              <td><GrayOutIfUnknown inline={false} content={normalizeLocation(event.location)} /></td>
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

function normalizeLocation(location: string): string {
  if (/^\s*https?:\/\//.test(location)) return location.trim();
  const replaced = location
    .trim()
    .replace(/^(MIT\s+)?Room\s+/, "")
    .replace(/\s*,\s*MIT$/, "");
  if (replaced === "") return replaced;
  return replaced.at(0)?.toUpperCase() + replaced.substring(1);
}
