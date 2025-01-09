import { NextResponse } from "next/server";
import { getAppServerSession } from "@/app/auth";
import { prisma } from "../../../db";
import { RequestStatus } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

// Handle friend request (accept/ignore)
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = getAppServerSession(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action } = await request.json();
    const requestId = parseInt(params.id);

    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    // Verify the request exists and is for the current user
    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        id: requestId,
        toEmail: session.user.email,
        status: RequestStatus.PENDING
      }
    });

    if (!friendRequest) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    if (action === 'accept') {
      // Create friendship and update request status in a transaction
      const result = await prisma.$transaction([
        prisma.friendship.create({
          data: {
            user1Email: friendRequest.fromEmail,
            user2Email: friendRequest.toEmail
          }
        }),
        prisma.friendRequest.update({
          where: { id: requestId },
          data: { status: RequestStatus.ACCEPTED }
        })
      ]);

      return NextResponse.json(result[0]);
    } else if (action === 'ignore') {
      const result = await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.IGNORED }
      });

      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error handling friend request:", error);
    return NextResponse.json(
      { error: "Failed to handle friend request" },
      { status: 500 }
    );
  }
}
