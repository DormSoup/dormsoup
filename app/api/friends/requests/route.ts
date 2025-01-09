import { NextResponse } from "next/server";
import { getAppServerSession } from "@/app/auth";
import { prisma } from "../../db";
import { RequestStatus } from "@prisma/client";

// Get user's friend requests
export async function GET(request: Request) {
  const session = getAppServerSession(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        toEmail: userEmail,
        status: RequestStatus.PENDING
      },
      include: {
        fromUser: {
          select: { email: true, name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch friend requests" },
      { status: 500 }
    );
  }
}

// Send a friend request
export async function POST(request: Request) {
  const session = getAppServerSession(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { toEmail } = await request.json();
    const fromEmail = session.user.email;

    // Validate input
    if (!toEmail || typeof toEmail !== 'string') {
      return NextResponse.json(
        { error: "Invalid recipient email" },
        { status: 400 }
      );
    }

    // Check if trying to friend self
    if (toEmail === fromEmail) {
      return NextResponse.json(
        { error: "Cannot send friend request to yourself" },
        { status: 400 }
      );
    }

    // Check if recipient exists
    const recipient = await prisma.emailSender.findUnique({
      where: { email: toEmail }
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    // Check if already friends
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { AND: [{ user1Email: fromEmail }, { user2Email: toEmail }] },
          { AND: [{ user1Email: toEmail }, { user2Email: fromEmail }] }
        ]
      }
    });

    if (existingFriendship) {
      return NextResponse.json(
        { error: "Already friends with this user" },
        { status: 400 }
      );
    }

    // Check for existing pending request
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        fromEmail,
        toEmail,
        status: RequestStatus.PENDING
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Friend request already sent" },
        { status: 400 }
      );
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        fromEmail,
        toEmail,
        status: RequestStatus.PENDING
      }
    });

    return NextResponse.json(friendRequest);
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
