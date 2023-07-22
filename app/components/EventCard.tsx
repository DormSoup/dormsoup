"use client";

import { faClock, faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SerializableEventWithTags } from "../EventType";
import { setCurrentEvent } from "../redux/eventDetailSlice";
import { likeEvent } from "../redux/searchSlice";
import { useAppDispatch } from "../redux/store";

import EventDate from "./EventDate";
import TagsBar from "./EventTagsBar";
import GrayOutIfUnknown from "./GrayOutUnknown";
import Likes from "./Likes";

type Props = {
  event: SerializableEventWithTags;
};

export default function EventCard({ event }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div
      className="relative flex h-[12rem] cursor-pointer select-none flex-col rounded-md border-2 border-gray-300 bg-white shadow-lg transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-gray-600 hover:shadow-2xl"
      onClick={() =>
        dispatch(setCurrentEvent({ ...event, date: new Date(event.date).toISOString() }))
      }
    >
      <div className="flex justify-between">
        <Likes event={event} />
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
              <td><EventDate date={event.date}/></td>
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
