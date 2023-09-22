"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import { setDisplayPastEvents } from "../redux/searchSlice";
import { RootState, useAppDispatch } from "../redux/store";

import CompactEventCard from "./CompactEventCard";
import { Tag } from "./EventTagsBar";
import Loading from "./Loading";
import SubscribeButton from "./SubscribeButton";
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
      <div className="mb-4 flex flex-row">
        <div className="text-xl">Common filters:</div>
        <div className="flex scale-90 flex-row space-x-2">
          <Tag key={"Free Food"} tag={"Free Food"} shape="capsule" />
          <Tag key={"Boba"} tag={"Boba"} shape="capsule" />
        </div>{" "}
      </div>
      <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <SubscribeButton />
        <div className="flex flex-row items-center">
          <Switch
            checked={displayPastEvents}
            onChange={() => dispatch(setDisplayPastEvents(!displayPastEvents))}
            text="Show Past Events"
          />
          <span className="ml-2 h-full align-text-top">Show past events</span>
        </div>
      </div>
      <div className="mt-4 text-center text-lg"> Click on events and tags to find more!</div>
      {uniqueDates.length === 0 ? (
        noEvents ? (
          <div className="text-3xl text-slate-400"> No events found with current filters. </div>
        ) : (
          <Loading randomNumber={new Date().getMinutes()} />
        )
      ) : (
        uniqueDates.map((date) => (
          <div key={date} className="flex w-full flex-col">
            <div className="mb-1 flex-none border-b-2 border-logo-red text-lg font-bold">
              {new Date(date + "T00:00:00-04:00").toLocaleDateString("en-US", options)}
            </div>
            <div className="flex-rows gap-4">
              {dateToEvents[date]?.map((event) => (
                <CompactEventCard event={event} key={event.id}></CompactEventCard>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
