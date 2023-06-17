import { PrismaClient } from "@prisma/client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCalendar, faUser, faClock } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

import ContentPreview from "./ContentPreview";
import EventDetail from "./EventDetail";
import EventCard from "./EventCard";

export default async function EventList() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const events = await prisma.event.findMany({
    include: { fromEmail: true },
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
