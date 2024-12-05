import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
        return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
        where: { eventId: parseInt(eventId, 10) },
        include: { replies: true },
        });

        return NextResponse.json(comments, { status: 200 });
        } catch (error) {
            console.error("Error fetching comments:", error);
            return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 });

        }
}

export async function POST(req: NextRequest) {
    try {
        const { text, userName, eventId, parentId } = await req.json();
    
        if (!text || !userName || !eventId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                text,
                userName,
                eventId: parseInt(eventId, 10),
                parentId: parentId ? parseInt(parentId, 10) : null,
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: 'Error creating comment' }, { status: 500 });
    }
}