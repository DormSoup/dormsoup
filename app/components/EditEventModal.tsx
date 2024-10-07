"use client";

import { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { useSelector } from "react-redux";

import { SerializableEvent, SerializableEventWithTags } from "../EventType";
import { clearModal } from "../redux/modalSlice";
import { setDisplayPastEvents } from "../redux/searchSlice";
import { RootState, useAppDispatch } from "../redux/store";

import Switch from "./Switch";

const EditEventModal = ({ event }: { event: SerializableEventWithTags }) => {
  const titleInput = useRef<HTMLSpanElement>(null);
  const dispatch = useAppDispatch();
  const defaultDate = new Date(event.date).toISOString().split("T")[0];
  const defaultTime = new Date(event.date).toISOString().split("T")[1].substring(0, 5);
  const [title, setTitle] = useState<string>(event.title);
  const [date, setDate] = useState<string>(defaultDate);
  const [time, setTime] = useState<string>(defaultTime);
  const [duration, setDuration] = useState<number>(event.duration);
  const [location, setLocation] = useState<string>(event.location);
  const [tags, setTags] = useState<string[]>(event.tags);

  const [isAllDayEvent, setIsAllDayEvent] = useState<boolean>(
    new Date(event.date).toISOString().includes("00:00:00.000Z")
  );

  const past = useSelector((state: RootState) => state.search.displayPastEvents);
  const applyHandler = () => {
    (async () => {
      const response = await fetch("/api/edit-event", {
        method: "POST",
        body: JSON.stringify({
          id: event.id,
          title,
          date: isAllDayEvent ? date : `${date}T${time}:00.000Z`,
          duration,
          location
          // tags
        })
      });
      if (response.status === 403) {
        alert("Permission denied");
        return;
      }
      await response.json();
      dispatch(setDisplayPastEvents(past));
      dispatch(clearModal());
    })();
  };

  useEffect(() => {
    if (titleInput && titleInput.current) {
      titleInput.current.textContent = event.title;
      const range = document.createRange();
      const sel = window.getSelection()!!;
      range.setStart(titleInput.current.childNodes[0], event.title.length); // move cursor to the end
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      titleInput.current.focus();
    }
  }, []);

  return (
    <div className="mx-4 mb-4 mt-1 flex w-80 flex-col space-y-4">
      <span
        ref={titleInput}
        className="text-lg font-bold outline-none"
        contentEditable={true}
        onInput={(e) => setTitle(e.currentTarget.textContent!!)}
      ></span>
      <div className="grid grid-flow-row grid-cols-[max-content_max-content] gap-x-4 gap-y-2">
        <div>Date</div>
        <input
          type="date"
          defaultValue={defaultDate}
          className="border-b"
          onChange={(e: any) => setDate(e.target.value)}
        ></input>
        {/* Use datepicker */}
        <div>All-day</div>
        <div>
          <Switch
            checked={isAllDayEvent}
            text="Full day event"
            onChange={() => setIsAllDayEvent(!isAllDayEvent)}
          />
        </div>
        {!isAllDayEvent && (
          <>
            <div>Time</div>
            <input
              type="time"
              defaultValue={defaultTime}
              className="border-b"
              onChange={(e: any) => setTime(e.target.value)}
            ></input>
            <div>Duration </div>
            <div className="flex flex-row  border-b">
              <input
                type="number"
                min="0"
                max="1440"
                step="30"
                defaultValue={event.duration}
                className="grow"
                onChange={(e: any) => setDuration(e.target.value)}
              />
              mins
            </div>
          </>
        )}
        <div>Location</div>
        <input
          type="text"
          defaultValue={event.location}
          className=" border-b"
          onChange={(e: any) => setLocation(e.target.value)}
        />
        {/* <div>Tags</div>
        <div>Talk, Queer (icon)</div>
        // Not editable for now
        */}
        <div>Delete</div>
        <button
          className="rounded-md bg-logo-red px-4 py-1 text-white transition-all duration-150 hover:-translate-y-0.5 hover:opacity-80 hover:shadow-lg"
          >
          Delete Tag
        </button>
      </div>
      <div className="flex justify-between">
        <button
          className="rounded-md bg-logo-red px-4 py-1 text-white transition-all duration-150 hover:-translate-y-0.5 hover:opacity-80 hover:shadow-lg"
          onClick={applyHandler}
        >
          Submit Changes
        </button>
        <button
          className="rounded-md bg-slate-200 px-4 py-1 text-white transition-all duration-150 hover:-translate-y-0.5 hover:opacity-80 hover:shadow-lg"
          onClick={() => dispatch(clearModal())}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditEventModal;
