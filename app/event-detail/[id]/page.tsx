import EventDetail from "../../components/EventDetail";
import { getEventDetail } from "../../api/event-detail/route";

export default async function EventDetailPage({ params: { id } }: { params: { id: string } }) {
  const eventDetail = await getEventDetail(parseInt(id));
  return (
    <div className="flex min-h-screen flex-col items-center rounded-lg bg-white shadow-lg">
      <EventDetail eventDetail={eventDetail} />
    </div>
  );
}
