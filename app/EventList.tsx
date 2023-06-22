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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard event={event} key={event.id}></EventCard>
        ))}
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
