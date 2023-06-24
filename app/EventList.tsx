"use client";

import { Switch } from "@headlessui/react";
import { Event } from "@prisma/client";

import { useEffect, useState } from "react";

import EventCard from "./EventCard";
import { Response as GetEventsResponse } from "./api/events/route";

export default function EventList() {
  const [dateToEvents, setDateToEvents] = useState(new Map<string, Event[]>());
  const [displayPastEvents, setDisplayPastEvents] = useState(false);

  useEffect(() => {
    const params = displayPastEvents
      ? new URLSearchParams({ order: "desc", until: new Date().toISOString() })
      : new URLSearchParams({ order: "asc", since: new Date().toISOString() });
    setDateToEvents(new Map<string, Event[]>());
    fetch("/api/events?" + params)
      .then((response) => response.json())
      .then((events: GetEventsResponse) => {
        const result = new Map<string, Event[]>();
        for (const event of events) {
          event.date = new Date(event.date);
          const formatted = event.date.toISOString().split("T")[0];
          const otherEvents = result.get(formatted);
          if (otherEvents === undefined) result.set(formatted, [event]);
          else otherEvents.push(event);
        }
        setDateToEvents(result);
      });
  }, [displayPastEvents]);

  let uniqueDates = [...dateToEvents.keys()];
  uniqueDates.sort();
  if (displayPastEvents) uniqueDates = uniqueDates.reverse();
  const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };

  return (
    <div>
      <div className="flex flex-row items-center">
        <Switch
          checked={displayPastEvents}
          onChange={setDisplayPastEvents}
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
      {dateToEvents.size === 0 ? (
        <div className="my-2 text-xl font-bold">Loading...</div>
      ) : (
        uniqueDates.map((date) => (
          <div key={date} className="flex w-full flex-col">
            <div className="my-2 flex-none border-b-2 border-logo-red text-xl font-bold">
              {new Date(date).toLocaleDateString("en-US", options)}
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
