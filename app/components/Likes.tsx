"use client";

import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SerializableEvent } from "../EventType";
import { likeEvent } from "../redux/searchSlice";
import { useAppDispatch } from "../redux/store";

export default function Likes({ event }: { event: SerializableEvent }) {
  const dispatch = useAppDispatch();
  return (
    <div
      className="flex flex-col items-center justify-center whitespace-nowrap pl-2 pt-1 text-red-500 transition-all duration-150 hover:scale-125"
      onClick={(clickEvent) => {
        dispatch(likeEvent(event.id));
        clickEvent.stopPropagation();
      }}
    >
      <FontAwesomeIcon icon={event.liked ? faHeartSolid : faHeart} />
      <div className={event.likes < 10 ? "text-md" : "text-sm"}> {event.likes} </div>
    </div>
  );
}

export function LikesHorizontal({ event }: { event: SerializableEvent }) {
  const dispatch = useAppDispatch();
  return (
    <div className="scale-110 whitespace-nowrap pl-2 pt-1 transition-all duration-150 hover:scale-125">
      <FontAwesomeIcon
        icon={event.liked ? faHeartSolid : faHeart}
        onClick={(clickEvent) => {
          dispatch(likeEvent(event.id));
          clickEvent.stopPropagation();
        }}
      />
      <span className="inline-block w-1"></span>
      {event.likes}
    </div>
  );
}
