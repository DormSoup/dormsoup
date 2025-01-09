import { NextResponse } from "next/server";
import { getAppServerSession } from "@/app/auth";
import { prisma } from "../db";
import { RequestStatus } from "@prisma/client";

// Get user's friends list
export async function GET(request: Request) {
  const session = getAppServerSession(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;
  
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Email: userEmail },
          { user2Email: userEmail }
        ]
      },
      include: {
        user1: {
          select: { email: true, name: true }
        },
        user2: {
          select: { email: true, name: true }
        }
      }
    });

    // Transform the data to always have the current user as user1
    const transformedFriends = friends.map(friendship => {
      if (friendship.user1Email === userEmail) {
        return {
          friendEmail: friendship.user2Email,
          friendName: friendship.user2.name,
          since: friendship.createdAt
        };
      } else {
        return {
          friendEmail: friendship.user1Email,
          friendName: friendship.user1.name,
          since: friendship.createdAt
        };
      }
    });

    return NextResponse.json(transformedFriends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
