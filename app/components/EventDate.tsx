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
  const dateObj = new Date(date);
  const isAllDay = dateObj.getUTCHours() === 0 && dateObj.getUTCMinutes() === 0;
  
  if (!includeDate) {
    if (isAllDay) {
      // For all-day events, show just the date portion
      return <>{dateObj.toLocaleDateString("en-US", DATE_ONLY_OPTIONS)}</>;
    }
    // For events with time, show just the time portion
    return <>{dateObj.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true })}</>;
  }

  // Show full date (and time if not all-day)
  const options = isAllDay ? DATE_ONLY_OPTIONS : DATE_TIME_OPTIONS;
  return <>{dateObj.toLocaleString("en-US", options)}</>;
}
