"use client";

import { faClock, faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLocation, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SerializableEventWithTags } from "../EventType";
import { setCurrentEvent } from "../redux/eventDetailSlice";
import { useAppDispatch } from "../redux/store";

import EventDate from "./EventDate";
import TagsBar from "./EventTagsBar";
import GrayOutIfUnknown from "./GrayOutUnknown";
import Likes from "./Likes";

type Props = {
  event: SerializableEventWithTags;
};

export default function CompactEventCard({ event }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div
      className="relative flex cursor-pointer select-none items-center rounded-md border-2 border-gray-300 bg-white shadow-lg transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-gray-600 hover:shadow-2xl"
      onClick={() =>
        dispatch(setCurrentEvent({ ...event, date: new Date(event.date).toISOString() }))
      }
    >
      <Likes event={event} />
      <div className="flex grow justify-between px-2">
        <div className="flex flex-col px-1">
          <div className="line-clamp-1 w-full overflow-hidden pt-0.5 text-lg font-extrabold">
            {event.title}
          </div>
          <div className="pb-0.5 text-xs">
            <span className="inline-block min-w-[9rem]">
              <span>
                <FontAwesomeIcon icon={faClock} />
              </span>
              <span className="inline-block w-1" />
              <span>
                <EventDate date={event.date} />
              </span>
            </span>
            <span className="inline-block w-1" />
            <span>
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <span>
              <GrayOutIfUnknown inline={true} content={normalizeLocation(event.location)} />
            </span>
          </div>
        </div>
        <TagsBar tags={event.tags.map((tag) => tag)} />
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
