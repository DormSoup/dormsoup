import { NextResponse } from "next/server";
import { getAppServerSession } from "@/app/auth";
import { prisma } from "../../db";

interface RouteParams {
  params: {
    email: string;
  };
}

// Remove friend
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = getAppServerSession(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;
    const friendEmail = decodeURIComponent(params.email);

    // Find and delete the friendship
    const deletedFriendship = await prisma.friendship.deleteMany({
      where: {
        OR: [
          { AND: [{ user1Email: userEmail }, { user2Email: friendEmail }] },
          { AND: [{ user1Email: friendEmail }, { user2Email: userEmail }] }
        ]
      }
    });

    if (deletedFriendship.count === 0) {
      return NextResponse.json(
        { error: "Friendship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing friend:", error);
    return NextResponse.json(
      { error: "Failed to remove friend" },
      { status: 500 }
    );
  }
}

// Get friendship status
export async function GET(request: Request, { params }: RouteParams) {
  const session = getAppServerSession(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;
    const targetEmail = decodeURIComponent(params.email);

    // Check if already friends
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { AND: [{ user1Email: userEmail }, { user2Email: targetEmail }] },
          { AND: [{ user1Email: targetEmail }, { user2Email: userEmail }] }
        ]
      }
    });

    if (existingFriendship) {
      return NextResponse.json({ status: 'friends' });
    }

    // Check for pending request
    const pendingRequest = await prisma.friendRequest.findFirst({
      where: {
        fromEmail: userEmail,
        toEmail: targetEmail,
        status: 'PENDING'
      }
    });

    if (pendingRequest) {
      return NextResponse.json({ status: 'pending' });
    }

    return NextResponse.json({ status: 'none' });
  } catch (error) {
    console.error("Error getting friendship status:", error);
    return NextResponse.json(
      { error: "Failed to get friendship status" },
      { status: 500 }
    );
  }
}
