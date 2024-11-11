// for client side rendering
"use client";

import { MouseEventHandler } from "react";

// import icons from FontAwesome
import { faCalendar, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SerializableEvent } from "../EventType";

// import React hooks (manages the local state of our components, such as # of likes)
import { useEffect, useState } from "react";

// Redux hooks for state management
// ex) useDispatch can be used to update the state when an event is liked
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";

// import redux actions
import { likeEvent } from "../redux/searchSlice";

// importing a function, atcb_action: handles the action when calendar button is clicked
import { atcb_action } from "add-to-calendar-button";
// getAppClientSession is a function for fetching session data
import { getAppClientSession } from "../authClient";
// for getting the username
import { Session } from "../api/auth/session/route";
// Importing GetEventDetailResponse for event detail typing
import { GetEventDetailResponse } from "../api/event-detail/route";

export default function Comments({ event, eventDetail }: { event: SerializableEvent; eventDetail: GetEventDetailResponse | undefined;}) {
    // setting up state for the session
    const [session, setSession] = useState<Session | undefined>(undefined);
    // hook to dispatch Redux actions
    const dispatch = useAppDispatch();

    useEffect(() => {
        getAppClientSession().then(setSession);
    }, []);

    // state variables for comments, input value, likes, and liked status
    const [comments, setComments] = useState<{ userName: string; text: string }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    // function to handle posting a comment
    const handlePost = () => {
        if (inputValue.trim() === "") return; // prevent empty comments
        setComments([...comments, { userName: session?.user?.name || "Anonymous", text: inputValue }]); // find out where to get the username
        setInputValue(""); // resetting input value
    };

    // function to handle "add to calendar"
    const onAddToCalendarClicked: MouseEventHandler<HTMLDivElement> = (clickEvent) => {
        if (event === undefined) return;
        const dateString = (date: Date) => date.toISOString().split("T")[0];
        const timeString = (date: Date) =>
            date
                .toISOString()
                .split("T")[1]
                .replace(/:\d{2}\.\d{3}Z$/i, "");
        const date = new Date(event.date);
        const endDate = new Date(date);
        endDate.setMinutes(date.getMinutes() + event.duration);

        const config: Parameters<typeof atcb_action>[0] = {
            name: event.title,
            startDate: dateString(date),
            options: ["Microsoft365", "Google", "Apple"],
            location: event.location,
            organizer: `${eventDetail?.fromEmail?.sender.name}|${eventDetail?.fromEmail?.sender.email}`,
            timeZone: "America/New_York",
            listStyle: "modal"
        };
        if (!date.toISOString().includes("00:00:00.000Z")) {
            config.startTime = timeString(date);
            config.endTime = timeString(endDate);
        }
        atcb_action(config, clickEvent.target as any as HTMLElement);
    };

    // function to handle like button click
    const onLikeButtonClicked: MouseEventHandler<HTMLDivElement> = (clickEvent) => {
        if (event === undefined) return;
        dispatch(likeEvent(event.id));
        clickEvent.stopPropagation(); // prevents triggering any parent click event handlers
    };

    // function that checks if the event exists
    const realEvent = useSelector((state: RootState) =>
        state.search.events.find((e) => e.id === event?.id)
    );

    return (
        <div>
            {/* Comment section UI */}
            <div className="comments-section">
                {comments.map((comment, index) => (
                    <div key={index}>
                        <span className="font-bold">{comment.userName}</span>: {comment.text}
                    </div>
                ))}

                {/* Likes and Calendar Buttons */}
                <div className="flex items-center mt-4 border border-t-black">
                    <div onClick={onLikeButtonClicked} className="cursor-pointer mr-4">
                        <FontAwesomeIcon icon={realEvent?.liked ? faHeartSolid : faHeart} />
                    </div>
                    <div onClick={onAddToCalendarClicked} className="cursor-pointer">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                </div>

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a comment..."
                    className="border rounded p-2"
                />
                <button onClick={handlePost} className="ml-2 p-2 bg-blue-500 text-black rounded flex items-center">
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                </button>
            </div>

        </div>
    );
}
