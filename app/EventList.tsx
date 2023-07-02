"use client";

import { Switch } from "@headlessui/react";
import { Event } from "@prisma/client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import EventCard from "./EventCard";
import { GetEventTextSearchResponse } from "./api/event-text-search/route";
import { GetEventsResponse } from "./api/events/route";
import { RootState } from "./redux/store";

export type EventWithTags = Omit<Event, "text"> & { tags: { name: string }[] };

export default function EventList() {
  const [events, setEvents] = useState<EventWithTags[]>([]);
  const [eventIdsWithMatchingTexts, setEventIdsWithMatchingTexts] = useState<Set<number>>(
    new Set()
  );
  const [displayPastEvents, setDisplayPastEvents] = useState(false);

  const keyword = useSelector((state: RootState) => state.search.keyword);

  useEffect(() => {
    const params = displayPastEvents
      ? new URLSearchParams({ order: "desc", until: new Date().toISOString() })
      : new URLSearchParams({ order: "asc", since: new Date().toISOString() });
    setEvents([]);
    fetch("/api/events?" + params)
      .then((response) => response.json())
      .then((events: GetEventsResponse) => {
        events.forEach((event) => (event.date = new Date(event.date)));
        setEvents(events);
      });
  }, [displayPastEvents]);

  useEffect(() => {
    const prevKeyword = keyword;
    setEventIdsWithMatchingTexts(new Set());
    if (keyword === "") return;
    fetch("/api/event-text-search?" + new URLSearchParams({ keyword }))
      .then((response) => response.json())
      .then((events: GetEventTextSearchResponse) => {
        if (prevKeyword === keyword)
          setEventIdsWithMatchingTexts(new Set([...events.map((event) => event.id)]));
      });
  }, [keyword]);

  const dateToEvents = new Map<string, EventWithTags[]>();
  const filteredEvents = events.filter((event) => {
    if (keyword === "") return true;
    if (eventIdsWithMatchingTexts.has(event.id)) return true;
    return [event.title, event.location, event.organizer].some((content) =>
      content.toLowerCase().includes(keyword)
    );
  });
  for (const event of filteredEvents) {
    const formatted = event.date.toISOString().split("T")[0];
    const otherEvents = dateToEvents.get(formatted);
    if (otherEvents === undefined) dateToEvents.set(formatted, [event]);
    else otherEvents.push(event);
  }
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
      {events.length === 0 ? (
        <div className="my-2 text-xl font-bold">Loading...</div>
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
