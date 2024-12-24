import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
        return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { eventId: Number(eventId), parent: null },
            include: {
                replies: {
                    include: { replies: true }, // Nested replies
                },
            },
        });
        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { text, userName, eventId, parentId } = body;

    if (!text || !userName || !eventId) {
        return NextResponse.json(
            { error: "Text, username, and event ID are required" },
            { status: 400 }
        );
    }

    try {
        const newComment = await prisma.comment.create({
            data: {
                text,
                userName,
                eventId: Number(eventId),
                parentId: parentId ? Number(parentId) : null,
            },
        });
        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error posting comment:", error);
        return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const { commentId, userEmail } = body;

    if (!commentId || !userEmail) {
        return NextResponse.json(
            { error: "Comment ID and user email are required" },
            { status: 400 }
        );
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentId) },
        });

        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        const authorEmail = comment.userName;
        if (authorEmail !== userEmail.split("@")[0]) {
            return NextResponse.json(
                { error: "You are not authorized to delete this comment" },
                { status: 403 }
            );
        }

        await prisma.comment.delete({
            where: { id: Number(commentId) },
        });
        return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}
