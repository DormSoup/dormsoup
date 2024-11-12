"use client";

import { faCalendar, faClock, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { atcb_action } from "add-to-calendar-button";
import IFrameResizer from "iframe-resizer-react";
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { MouseEventHandler, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { SerializableEvent } from "../EventType";
import { GetEventDetailResponse } from "../api/event-detail/route";
import { likeEvent } from "../redux/searchSlice";
import { RootState, useAppDispatch } from "../redux/store";

import EventDate from "./EventDate";
import GrayOutIfUnknown from "./GrayOutUnknown";
import Loading from "./Loading";

export default function EventDetail({ event }: { event: SerializableEvent }) {
  const dispatch = useAppDispatch();
  const [eventDetail, setEventDetail] = useState<GetEventDetailResponse | undefined>(undefined);
  useEffect(() => {
    setEventDetail(undefined);
    if (event === undefined) return;
    fetch("/api/event-detail?" + new URLSearchParams({ id: event.id.toString() }))
      .then((response) => response.json())
      .then((response: GetEventDetailResponse) => setEventDetail(response));
  }, [event]);

  return (
    <>
      <div className="flex flex-none flex-row gap-2 px-2">
        <div className="font-medium">
          <FontAwesomeIcon icon={faClock} />
          {"  "}
          <EventDate date={event.date} includeDate={true} />
        </div>
        <div>
          <FontAwesomeIcon icon={faLocationDot} />
          {"  "}
          <GrayOutIfUnknown inline={true} content={eventDetail?.location ?? ""} />
        </div>
      </div>
      {eventDetail === undefined || eventDetail === null ? (
        <Loading randomNumber={new Date().getMinutes()} />
      ) : (
        <>
          <div className="m-1 flex-none border-b-2 border-gray-300 p-1 text-xs text-gray-500">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-32"></col>
                <col className="truncate"></col>
              </colgroup>
              <tbody>
                <tr>
                  <td>Original subject: </td>
                  <td>{eventDetail.fromEmail?.subject}</td>
                </tr>
                <tr>
                  <td>Recieved Date: </td>
                  <td>
                    {eventDetail.fromEmail?.receivedAt ? (
                      <EventDate
                        date={event.recievedDate ? event.recievedDate.toString() : event.date}
                        includeDate={true}
                      />
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td>From: </td>
                  <td>
                    {eventDetail.fromEmail?.sender.name} (
                    <a
                      className="hover:text-sky-500"
                      href={"mailto:" + eventDetail?.fromEmail?.sender.email}
                    >
                      {eventDetail.fromEmail?.sender.email}
                    </a>
                    )
                  </td>
                </tr>
                <tr>
                  <td>Processed by: </td>
                  <td>{eventDetail.fromEmail?.modelName}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <IFrameResizer
            className="min-h-0 w-full shrink"
            srcDoc={prepareEmailBody(eventDetail.fromEmail?.body)}
            checkOrigin={false}
            scrolling={true}
          ></IFrameResizer>
        </>
      )}
    </>
  );
}

/**
 * Inserts the iframe resizer script into the HTML body,
 * and ensure that all links within the iframe will open a new tab.
 *
 * @param body The email body HTML.
 * @returns
 */
function prepareEmailBody(body: string | undefined): string | undefined {
  if (body === undefined) return undefined;
  const emailDocument = document.createElement("html");
  emailDocument.innerHTML = body;
  const scriptTag = document.createElement("script");
  scriptTag.src =
    "https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.6/js/iframeResizer.contentWindow.min.js";
  let hasHead = false;
  for (let child of emailDocument.children) {
    if (child.tagName === "HEAD") {
      child.insertBefore(scriptTag, child.firstChild);
      hasHead = true;
      break;
    }
  }
  if (!hasHead) emailDocument.insertBefore(scriptTag, emailDocument.firstChild);

  for (let a of emailDocument.getElementsByTagName("a")) a.setAttribute("target", "_blank");

  return emailDocument.outerHTML;
}