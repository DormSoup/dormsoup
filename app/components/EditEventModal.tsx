"use client";

import { useEffect, useRef, useState } from "react";

import { SerializableEvent } from "../EventType";
import { clearModal } from "../redux/modalSlice";
import { useAppDispatch } from "../redux/store";

import Switch from "./Switch";

const EditEventModal = ({ event }: { event: SerializableEvent }) => {
  const titleInput = useRef<HTMLSpanElement>(null);
  const dispatch = useAppDispatch();

  const [isAllDayEvent, setIsAllDayEvent] = useState<boolean>(
    new Date(event.date).toISOString().includes("00:00:00.000Z")
  );

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
    <div className="mx-4 mb-4 mt-1 flex flex-col space-y-4">
      <span
        ref={titleInput}
        className="text-lg font-bold outline-none"
        contentEditable={true}
      ></span>
      <div className="grid grid-flow-row grid-cols-[max-content_max-content] gap-x-4 gap-y-2">
        <div>Date</div>
        <div>{new Date(event.date).toISOString().split("T")[0]}</div>
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
            <div>{event.date}</div>
            <div>Duration</div>
            <div> {event.duration}</div>
          </>
        )}
        <div>Location</div>
        <div>{event.location}</div>
        <div>Tags</div>
        <div>Talk, Queer (icon)</div>
      </div>
      <div className="flex justify-between">
        <button className="rounded-md bg-logo-red px-4 py-1 text-white transition-all duration-150 hover:-translate-y-0.5 hover:opacity-80 hover:shadow-lg">
          Apply
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
