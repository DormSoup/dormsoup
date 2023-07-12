"use client";

import { Switch } from "@headlessui/react";

import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { setDisplayPastEvents } from "../redux/searchSlice";
import { RootState, useAppDispatch } from "../redux/store";

import EventCard from "./EventCard";

export default function EventList() {
  const displayPastEvents = useSelector((state: RootState) => state.search.displayPastEvents);
  const dateToEvents = useSelector((state: RootState) => state.search.dateToEvents);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setDisplayPastEvents(displayPastEvents));
  }, []);
  let uniqueDates = [...dateToEvents.keys()];
  uniqueDates.sort();
  if (displayPastEvents) uniqueDates = uniqueDates.reverse();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York"
  };

  return (
    <div>
      <div className="flex flex-row items-center">
        <Switch
          checked={displayPastEvents}
          onChange={() => dispatch(setDisplayPastEvents(!displayPastEvents))}
          className={`${
            displayPastEvents ? "bg-logo-red" : "bg-gray-300"
          } relative box-content inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Show past events</span>
          <span
            className={`${
              displayPastEvents ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <span className="ml-2 h-full align-text-top">Show past events</span>
      </div>
      {uniqueDates.length === 0 ? (
        <>
          <Image src="/loading.gif" alt="Loading animation" width={100} height={100} className="mx-auto w-80"></Image>
          <div className="mt-[-4rem] text-5xl text-center font-bold">Loading...</div>
        </>
      ) : (
        uniqueDates.map((date) => (
          <div key={date} className="flex w-full flex-col">
            <div className="my-2 flex-none border-b-2 border-logo-red text-xl font-bold">
              {new Date(date + "T00:00:00-04:00").toLocaleDateString("en-US", options)}
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {dateToEvents.get(date)?.map((event) => (
                <EventCard event={event} key={event.id}></EventCard>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
