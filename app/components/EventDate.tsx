const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric", // "7"
  minute: "2-digit", // "00"
  hour12: true, // "PM"
  timeZone: "UTC"
};

// TODO: make two date_options, one for EventDate, another for EventDateTime

export default function EventDate({ date, includeDate }: { date: string; includeDate: boolean }) {
  const formatted = new Date(date)
    .toLocaleString("en-US", DATE_OPTIONS)
    .replaceAll(/,\s+12:00\s+AM/giu, "");
  // if we do not include date, split the string and return the last two words
  // so that for all-day events we get the dates and for non-all-day events we get the time
  if (!includeDate) {
    const split = formatted.split(", ");
    return <>{split[split.length - 1]}</>;
  }
  return <>{formatted}</>;
}
