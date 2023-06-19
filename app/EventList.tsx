import { PrismaClient } from "@prisma/client";

import EventCard from "./EventCard";

export default async function EventList() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" }
  });

  try {
    return (
      <div className="flex flex-row flex-wrap gap-4">
        {events.map((event) => (
          <EventCard event={event} key={event.id}></EventCard>
        ))}
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
