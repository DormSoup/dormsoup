"use client";

import d from 'next/dynamic'

export const dynamic = "force-dynamic";

const DynamicModal = d(() => import('../../../components/Modal'), {
    ssr: false
})

import { GetEventDetailResponse } from "@/app/api/event-detail/route";
import EventDetail from "@/app/components/EventDetail";
// import Modal from "@/app/components/Modal";

import { useEffect, useState } from "react";

export default async function EventDetailModal({ params: { id } }: { params: { id: string } }) {
  const [eventDetail, setEventDetail] = useState<GetEventDetailResponse | undefined>(undefined);
  useEffect(() => {
    fetch("/api/event-detail?" + new URLSearchParams({ id: id.toString() }))
      .then((response) => response.json())
      .then((response: GetEventDetailResponse) => setEventDetail(response));
  }, []);

  return (
    <DynamicModal title={eventDetail?.title}>
      {eventDetail === undefined ? undefined : <EventDetail eventDetail={eventDetail} />}
    </DynamicModal>
  );
}
