"use client";

import { SerializableEvent } from "../EventType";
import { useEffect, useRef, useState } from "react";
import { getAppClientSession } from "../authClient";
import { Session } from "../api/auth/session/route";
import { GetEventDetailResponse } from "../api/event-detail/route";

type Reply = {
    id: number;
    userName: string;
    text: string;
    replies: Reply[];
};

type Comment = {
    id: number;
    userName: string;
    text: string;
    replies: Reply[];
};

export default function Comments({ event }: { event: SerializableEvent; }) {
    const [session, setSession] = useState<Session | undefined>(undefined);
    const [eventDetail, setEventDetail] = useState<GetEventDetailResponse | undefined>(undefined);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
    const [replyToUserName, setReplyToUserName] = useState<string | null>(null);

    useEffect(() => {
        getAppClientSession().then(setSession);
    }, []);

    useEffect(() => {
        if (event) {
            fetch(`/api/event-detail?id=${event.id}`)
                .then((response) => response.json())
                .then((data: GetEventDetailResponse) => setEventDetail(data))
                .catch((error) => console.error("Failed to fetch event detail:", error));
        }
    }, [event]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setComments([]);
                const response = await fetch(`/api/comments?eventId=${event.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch comments");
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [event.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (textareaRef.current !== null) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleReplyClick = (commentId: number, userName: string) => {
        const result = findCommentOrReplyById(comments, commentId);
        if (result) {
            const { comment, parent } = result;
            console.log("Replying to comment or reply:", comment);
            if (parent) {
                console.log("Parent comment:", parent);
            }
        } else {
            console.log(`Comment or reply with id ${commentId} not found.`);
        }
        setReplyToCommentId(commentId);
        setReplyToUserName(userName);
        setInputValue(`@${userName} `);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handlePost();
        }
    };

    const findCommentOrReplyById = (
        commentsList: typeof comments,
        id: number
    ): { comment: any; parent: any } | null => {
        for (let comment of commentsList) {
            if (comment.id === id) {
                return { comment, parent: null };
            }
            for (let reply of comment.replies) {
                if (reply.id === id) {
                    return { comment: reply, parent: comment };
                }
            }
        }
        return null;
    };

    const handlePost = async () => {
        if (inputValue.trim() === "") return;

        const newComment = {
            text: inputValue.trim(),
            userName: session?.user?.email?.split("@")[0] || "Anonymous",
            eventId: event.id,
            parentId: replyToCommentId || null,
            replies: [],
        };

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment),
            });

            if (!response.ok) {
                throw new Error("Failed to post comment");
            }

            const createdComment = await response.json();
            
            if (replyToCommentId !== null) {
                const updatedComments = [...comments];
                const addReplyToCommentOrReply = (commentsList: Comment[], id: number, reply: Comment): boolean => {
                    for (let comment of commentsList) {
                        if (comment.id === id) {
                            if (!Array.isArray(comment.replies)) {
                                comment.replies = [];
                            }
                            comment.replies.push(reply);
                            return true;
                        }
                        if (Array.isArray(comment.replies) && addReplyToCommentOrReply(comment.replies, id, reply)) {
                            return true;
                        }
                    }
                    return false;
                };

                const success = addReplyToCommentOrReply(updatedComments, replyToCommentId, createdComment);
                if (!success) {
                    console.error("Failed to add reply", addReplyToCommentOrReply);
                }

                setComments(updatedComments);
                console.log("Updated comments state:", updatedComments);

                setReplyToCommentId(null);
                setReplyToUserName(null);
            } else {
                setComments([...comments, createdComment]);
            }

            setInputValue("");
            if (textareaRef.current != null) {
                textareaRef.current.style.height = "auto";
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const renderReplies = (replies: Reply[] | undefined) => {
        return (replies ?? []).map((reply) => (
            // add ml-3 here if you want hierarchy within the reply's replies
            <div key={reply.id} className="mt-3">
                <div className="flex items-start space-x-4">
                    {/* Username */}
                    <span
                        className="text-xs text-white bg-logo-red border border-logo-red rounded-full px-3 py-1"
                        style={{ flexShrink: 0 }}
                    >
                        {reply.userName}
                    </span>
    
                    {/* Comment and Buttons */}
                    <div className="flex-1">
                        {/* Comment Text */}
                        <p className="break-words text-xs">{reply.text}</p>
    
                        {/* Buttons for replies */}
                        <div className="flex space-x-4 mt-1 text-xs text-slate-400">
                            <button
                                onClick={() => handleReplyClick(reply.id, reply.userName)}
                                className="hover:text-black"
                            >
                                Reply
                            </button>
                            {/* <button
                                onClick={() => handleDeleteComment(reply.id, reply.userName)}
                                className="hover:text-black"
                            >
                                Delete
                            </button> */}
                        </div>
                    </div>
                </div>
    
                {/* reply's reply */}
                {reply.replies?.length > 0 && (
                    <div className="mt-2">
                        {renderReplies(reply.replies)}
                    </div>
                )}
            </div>
        ));
    };
    

    const deleteCommentOrReplyById = (commentsList: Comment[] | undefined, id: number): Comment[] => {
        if (!commentsList) return [];

        return commentsList.filter((comment) => {
            if (comment.id === id) return false;
            comment.replies = deleteCommentOrReplyById(comment.replies, id);
            return true;
        });
    };
    
    // const handleDeleteComment = async (commentId: number, userName: string) => {
    //     const isAuthor = session?.user?.email?.split("@")[0] === userName;
    
    //     if (!isAuthor) {
    //         alert("You are not authorized to delete this comment.");
    //         return;
    //     }
    
    //     try {
    //         const response = await fetch("/api/comments", {
    //             method: "DELETE",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ commentId, userEmail: session?.user?.email }),
    //         });
    
    //         if (!response.ok) {
    //             throw new Error("Failed to delete comment");
    //         }
    
    //         setComments((prevComments) => deleteCommentOrReplyById(prevComments, commentId));
    //     } catch (error) {
    //         console.error("Error deleting comment:", error);
    //     }
    // };

    return (
        <div className="flex flex-col h-full">

            {/* Comment Section */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {comments.length === 0 ? (
                    <div className="text-slate-400">No comments</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id}>
                            <div className="flex items-start space-x-4">
                                {/* Username */}
                                <span
                                    className="text-xs text-white bg-logo-yellow border border-logo-yellow rounded-full px-3 py-1"
                                    style={{ flexShrink: 0 }}
                                >
                                    {comment.userName}
                                </span>

                                {/* Comment and Buttons */}
                                <div className="flex-1">
                                    {/* Comment Text */}
                                    <p className="break-words text-xs">{comment.text}</p>

                                    {/* Buttons for root comment */}
                                    <div className="flex space-x-4 mt-1 text-xs text-slate-400">
                                        <button
                                            onClick={() => handleReplyClick(comment.id, comment.userName)}
                                            className="hover:text-black"
                                        >
                                            Reply
                                        </button>
                                        {/* <button
                                            onClick={() => handleDeleteComment(comment.id, comment.userName)}
                                            className="hover:text-black"
                                        >
                                            Delete
                                        </button> */}
                                    </div>
                                </div>
                            </div>

                            {/* Reply to parent comment */}
                            <div className="ml-3 mt-2 space-y-2">
                                {renderReplies(comment.replies)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Fixed Footer */}
            <div className="bg-white">

                {/* Comment Input Section */}
                <div className="py-2">
                    <div className="flex flex-row items-center">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a comment..."
                            className="flex-1 border-2 border-gray-300 rounded-lg p-2 text-xs placeholder:pl-2 resize-none overflow-hidden focus:outline-none"
                            rows={1}
                        />
                        <button
                            onClick={handlePost}
                            className="ml-2 px-4 py-2 text-xs text-white  bg-black hover:bg-gray-300 rounded-lg"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
