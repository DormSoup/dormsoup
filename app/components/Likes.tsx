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
    <div className="scale-110 whitespace-nowrap pl-2 pt-1 text-red-500 transition-all duration-150 hover:scale-125">
      <FontAwesomeIcon
        icon={event.liked ? faHeartSolid : faHeart}
        onClick={(clickEvent) => {
          dispatch(likeEvent(event.id));
          clickEvent.stopPropagation();
        }}
      />
      <span className="inline-block w-1" />
      {event.likes}
    </div>
  );
}
