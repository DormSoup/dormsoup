"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { setDisplayPastEvents } from "../redux/searchSlice";
import { RootState, useAppDispatch } from "../redux/store";

import CompactEventCard from "./CompactEventCard";
import Switch from "./Switch";

export default function CompactEventList() {
  const displayPastEvents = useSelector((state: RootState) => state.search.displayPastEvents);
  const dateToEvents = useSelector((state: RootState) => state.search.dateToEvents);
  const noEvents = useSelector((state: RootState) => state.search.noEvents);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setDisplayPastEvents(displayPastEvents));
  }, [displayPastEvents, dispatch]);
  let uniqueDates = [...Object.keys(dateToEvents)];
  uniqueDates.sort();
  if (displayPastEvents) uniqueDates = uniqueDates.reverse();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York"
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="flex flex-row items-center">
        <Switch
          checked={displayPastEvents}
          onChange={() => dispatch(setDisplayPastEvents(!displayPastEvents))}
          text="Show Past Events"
        />
        <span className="ml-2 h-full align-text-top">Show past events</span>
      </div>
      {uniqueDates.length === 0 ? (
        noEvents ? (
          <div className="text-3xl text-slate-400"> No events found with current filters. </div>
        ) : (
          <>
            <Image
              src="/loading.gif"
              alt="Loading animation"
              width={100}
              height={100}
              className="mx-auto w-80"
            ></Image>
            <div className="mt-[-4rem] text-center text-5xl font-bold">Loading...</div>
          </>
        )
      ) : (
        uniqueDates.map((date) => (
          <div key={date} className="flex w-full flex-col">
            <div className="mb-1 flex-none border-b-2 border-logo-red text-lg font-bold">
              {new Date(date + "T00:00:00-04:00").toLocaleDateString("en-US", options)}
            </div>
            <div className="flex-rows gap-4">
              {dateToEvents[date]?.map((event) => (
                <CompactEventCard event={event} key={event.id} editable={true}></CompactEventCard>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
