import { getAppServerSession, isAdmin } from "@/app/auth";
import { NextResponse } from "next/server";
import { prisma } from "../db";


async function allowDelete(eventId: number, userEmail: string): Promise<boolean> {
    if (isAdmin(userEmail)) return true;
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { fromEmail: { select: { senderEmail: true } } }
    });
    if (!event) return false;
    return event.fromEmail?.senderEmail === userEmail;
}

async function deleteEvent(eventId: number): Promise<void> {
    try {
        await prisma.event.delete({
            where: { id: eventId }
        });
        console.log(`Successfully deleted event ${eventId}.`)
    } catch (error) {
        console.error(`Error deleting the event ${eventId}: `, error);
        throw new Error(`Failed to delete event ${eventId}.`);
    }
}

export async function DELETE(request: Request) {
    const session = await getAppServerSession(request);
    if (!session) return NextResponse.json("access denied", { status: 403 });

    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));

    if (!id) {
        return NextResponse.json("Invalid event ID", { status: 400 });
    }

    if (!(await allowDelete(id, session.user.email))) {
        return NextResponse.json("access denied", { status: 403 });
    }
    try {
        await deleteEvent(id);
        return NextResponse.json({ success: true });
        } catch (error) {
        console.error(`Error in DELETE route: ${error}`);
        return NextResponse.json("Internal server error", { status: 500 });
        }
}
