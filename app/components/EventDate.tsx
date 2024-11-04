const DATE_ONLY_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC"
};

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC"
};

export default function EventDate({ date, includeDate }: { date: string; includeDate: boolean }) {
  const normalizedDate = date.includes("T") ? date : `${date}T00:00:00Z`;
  const dateObj = new Date(normalizedDate);
  const isAllDay = dateObj.getUTCHours() === 0 && dateObj.getUTCMinutes() === 0;

  if (!includeDate) {
    if (isAllDay) {
      return <>{dateObj.toLocaleDateString("en-US", DATE_ONLY_OPTIONS)}</>;
    }
    return (
      <>
        {dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC"
        })}
      </>
    );
  }

  const options = isAllDay ? DATE_ONLY_OPTIONS : DATE_TIME_OPTIONS;
  return <>{dateObj.toLocaleString("en-US", options)}</>;
}
