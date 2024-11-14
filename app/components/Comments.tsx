// for client side rendering
"use client";

import { MouseEventHandler } from "react";

// import icons from FontAwesome
import { faCalendar, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SerializableEvent } from "../EventType";

// import React hooks (manages the local state of our components, such as # of likes)
import { useEffect, useRef, useState } from "react";

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

export default function Comments({ event }: { event: SerializableEvent; }) {
    // setting up state for the session and eventDetail
    const [session, setSession] = useState<Session | undefined>(undefined);
    const [eventDetail, setEventDetail] = useState<GetEventDetailResponse | undefined>(undefined);
    // hook to dispatch Redux actions
    const dispatch = useAppDispatch();
    // Use ref to get a reference to the textarea element
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // fetch session data
    useEffect(() => {
        getAppClientSession().then(setSession);
    }, []);

    // Fetch eventDetail data
    useEffect(() => {
        if (event) {
            fetch(`/api/event-detail?id=${event.id}`)
                .then((response) => response.json())
                .then((data: GetEventDetailResponse) => setEventDetail(data))
                .catch((error) => console.error("Failed to fetch event detail:", error));
        }
    }, [event]);

    // state variables for comments, input value, likes, and liked status
    const [comments, setComments] = useState<
        { id: number; userName: string; text: string; replies: { id: number; userName: string; text: string }[] }[]
    >([]);
    const [inputValue, setInputValue] = useState("");
    const [likes, setLikes] = useState(event.likes);
    const [liked, setLiked] = useState(event.liked);
    const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
    const [replyToUserName, setReplyToUserName] = useState<string | null>(null);

    // Function to handle text input changes and adjust textarea height
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        // Adjust the height of the textarea
        if (textareaRef.current !== null) {
            textareaRef.current.style.height = "auto"; // Reset the height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
        }
    };

    // Function to handle keydown event
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent the default behavior of Enter key (i.e., adding a new line)
            handlePost(); // Call the handlePost function
        }
    };

    const handleReplyClick = (commentId: number, userName: string) => {
        console.log("replying to comment id:", commentId);
        setReplyToCommentId(commentId);
        setReplyToUserName(userName);
        setInputValue(`@${userName} `);
        textareaRef.current?.focus(); // Focus on the input box
    };

    const handlePost = () => {
        if (inputValue.trim() === "") return;

        if (replyToCommentId !== null) {
            // Handle posting a reply to a specific comment
            const newComments = [...comments];
            const parentCommentIndex = newComments.findIndex(comment => comment.id === replyToCommentId);
            if (parentCommentIndex !== -1) {
                newComments[parentCommentIndex].replies.push({
                    id: Date.now(), // Generate a unique ID for the reply
                    userName: session?.user?.name || "Anonymous",
                    text: inputValue
                });
                setComments(newComments);
            }
            setReplyToCommentId(null); // Clear the reply state
            setReplyToUserName(null);
        } else {
            // Handle posting a regular comment
            const newComment = {
                id: Date.now(), // Use a unique ID for each comment
                userName: session?.user?.name || "Anonymous",
                text: inputValue,
                replies: []
            };
            setComments([...comments, newComment]);
        }

        setInputValue("");
        if (textareaRef.current != null) {
            textareaRef.current.style.height = "auto";
        }
    };

    // function to handle "add to calendar"
    const onAddToCalendarClicked: MouseEventHandler<HTMLDivElement> = (clickEvent) => {
        if (!event) return;
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

        // Toggle liked status and update likes count
        if (liked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setLiked(!liked); // Toggle the liked state

        dispatch(likeEvent(event.id));
        clickEvent.stopPropagation(); // prevents triggering any parent click event handlers
    };

    // function that checks if the event exists
    const realEvent = useSelector((state: RootState) =>
        state.search.events.find((e) => e.id === event?.id)
    );

    return (
        <div className="flex flex-col h-full">

            {/* Comment Section */}
            <div className="flex-1 px-4 py-4 space-y-4">
                {comments.length === 0 ? (
                    <div className="text-slate-400">No comments</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="my-2 break-words mr-2">
                            <span className="text-sm text-white bg-logo-yellow border border-logo-yellow rounded-full px-3 py-1 mr-2">
                                {comment.userName}
                            </span>
                            {comment.text}
                            <div>
                                <button
                                    onClick={() => handleReplyClick(comment.id, comment.userName)}
                                    className="ml-2 mt-1 text-sm text-slate-400 hover:text-black"
                                >
                                    Reply
                                </button>
                            </div>

                            {/* Reply Section */}
                            <div className="ml-6 mt-2 space-y-2">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="space-y-1">
                                        <span className="text-sm text-white bg-logo-red border border-logo-red rounded-full px-3 py-1 mr-2">
                                            {reply.userName}
                                        </span>
                                        {reply.text}
                                        <div>
                                            <button
                                                onClick={() => handleReplyClick(reply.id, reply.userName)}
                                                className="ml-2 mt-1 text-sm text-slate-400 hover:text-black"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Likes and Calendar Buttons */}
            <div className="flex items-center px-4 py-2 border-t border-gray-300">
                <div onClick={onLikeButtonClicked} className="cursor-pointer mr-4">
                    <FontAwesomeIcon icon={realEvent?.liked ? faHeartSolid : faHeart} />
                </div>
                <div onClick={onAddToCalendarClicked} className="cursor-pointer">
                    <FontAwesomeIcon icon={faCalendar} />
                </div>
            </div>

            <div className="ml-4 text-sm mb-4">
                {likes} {likes === 1 ? "like" : "likes"}
            </div>

            {/* Comment Input Section */}
            <div className="mb-4 ml-4">
                <div className="flex flex-row items-center">
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a comment..."
                        className="flex-1 border rounded-lg p-2 resize-none overflow-hidden"
                        rows={1}
                    />
                    <button onClick={handlePost} className="mx-2 p-2 text-slate-400 hover:text-black rounded">
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
