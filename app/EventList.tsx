import { PrismaClient } from "@prisma/client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCalendar, faUser } from "@fortawesome/free-regular-svg-icons";

import ContentPreview from "./ContentPreview";

export default async function EventList() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const events = await prisma.event.findMany({
    include: { fromEmail: true },
    orderBy: { date: "desc" }
  });

  try {
    return (
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={`${event.id}`}
            className="cursor-pointer rounded-md border-2 border-gray-300 bg-white hover:border-gray-600"
          >
            <div className="flex flex-row text-xs text-gray-500">
              <div className="grow truncate p-2 text-left">
                <FontAwesomeIcon icon={faUser}/>  {event.organizer}
              </div>
              <div className="flex-none p-2 text-right">{event.date.toDateString()}</div>
            </div>

            <div className="px-2 pb-2 text-lg font-bold">{event.title}</div>
            <ContentPreview html={event.fromEmail?.body} />

            <div className="flex flex-row border-t border-gray-300">
              <div className="grow rounded-bl-md py-2 text-center text-sm hover:bg-gray-200">
                <FontAwesomeIcon icon={faHeart} size="xl" className="text-red-500" /> &nbsp; Add to
                my events
              </div>
              <div className="flex-none border-l border-gray-300" />
              <div className="grow rounded-br-md py-2 text-center text-sm hover:bg-gray-200">
                <FontAwesomeIcon icon={faCalendar} size="xl" /> &nbsp; Add to calendar
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}