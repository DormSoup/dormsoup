"use client";

import { faClock, faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLocation, faLocationDot, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

import { SerializableEventWithTags } from "../EventType";
import { setEditEventModal, setEventDetailModal } from "../redux/modalSlice";
import { useAppDispatch } from "../redux/store";
import { compareIgnoreCase } from "../util";

import EventDate from "./EventDate";
import TagsBar, { Tag, sortTags } from "./EventTagsBar";
import GrayOutIfUnknown from "./GrayOutUnknown";
import Likes from "./Likes";

type Props = {
  event: SerializableEventWithTags;
  bySentDate: boolean;
};

export default function CompactEventCard({ event, bySentDate }: Props) {
  const dispatch = useAppDispatch();
  const isSIPB =
    compareIgnoreCase(event.organizer, "SIPB") ||
    compareIgnoreCase(event.organizer, "Student Information Processing Board");
  const cardRef = useRef<HTMLDivElement>(null); // Ref for the card div
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (cardRef.current) {
      const updateDimensions = () => {
        setDimensions({
          width: cardRef.current!.offsetWidth,
          height: cardRef.current!.offsetHeight
        });
      };

      updateDimensions(); // Initial update
      window.addEventListener("resize", updateDimensions); // Update on resize

      return () => window.removeEventListener("resize", updateDimensions); // Cleanup listener
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative flex cursor-pointer select-none items-center overflow-hidden rounded-md border-2 border-gray-300 bg-white shadow-lg transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-gray-600 hover:shadow-2xl"
      onClick={() => dispatch(setEventDetailModal(event))}
    >
      {isSIPB && <Confetti ref={confettiRef} width={dimensions.width} height={dimensions.height} />}
      <Likes event={event} />
      <div className="w-0 flex-1 px-2">
        <div className="line-clamp-1 w-full overflow-hidden pt-0.5 text-lg font-extrabold">
          {event.editable && (
            <span
              className="mr-2 inline-block transition-all duration-150 hover:-translate-y-0.5 hover:text-logo-red hover:shadow-lg"
              onClick={(clickEvent) => {
                dispatch(setEditEventModal(event));
                clickEvent.stopPropagation();
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </span>
          )}
          {event.title}
        </div>
        <div className="truncate whitespace-nowrap pb-0.5 text-xs">
          <span className="inline-block min-w-[5rem]">
            <span>
              <FontAwesomeIcon icon={faClock} />
            </span>
            <span className="inline-block w-1" />
            <span>
              <EventDate
                date={
                  bySentDate
                    ? event.recievedDate
                      ? event.recievedDate.toString()
                      : event.date
                    : event.date
                }
                includeDate={false}
              />
            </span>
          </span>
          <span className="inline-block w-1" />
          <span>
            <FontAwesomeIcon icon={faLocationDot} />
          </span>
          <span className="truncate">
            <GrayOutIfUnknown inline={true} content={normalizeLocation(event.location)} />
          </span>
        </div>
      </div>
      <div className="flex self-start">
        {isSIPB && (
          <Image
            src="/fuzzball.png"
            alt="SIPB Logo"
            width={24}
            height={24}
            className="mt-5 object-contain"
          />
        )}
        <TagsBar tags={event.tags.slice(0)} />
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
