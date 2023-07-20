const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric", // "7"
  minute: "2-digit", // "00"
  hour12: true, // "PM"
  timeZone: "UTC"
};

export default function EventDate({ date }: { date: string }) {
  const formatted = new Date(date).toLocaleString("en-US", DATE_OPTIONS).replaceAll(", 12:00 AM", "");
  return <>{formatted}</> 
}