const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric", // "7"
  minute: "2-digit", // "00"
  hour12: true, // "PM"
  timeZone: "UTC"
};
("12:00 AM");

export default function EventDate({ date }: { date: string }) {
  const formatted = new Date(date)
    .toLocaleString("en-US", DATE_OPTIONS)
    .replaceAll(/,\s+12:00\s+AM/giu, "");
  return <>{formatted}</>;
}
