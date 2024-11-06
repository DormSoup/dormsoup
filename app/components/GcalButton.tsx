import Image from "next/image";

export default function GcalButton() {
  return (
    <a
      className="flex w-full flex-row items-center justify-center rounded-md bg-white px-4 py-1 text-lg font-semibold transition-opacity hover:opacity-75 md:w-auto"
      target="_blank"
      href="https://calendar.google.com/calendar/u/0?cid=Y18zNjE2MDRhYThlZGRjNGJlMTA0NmI0ZmJmODNhYmZkYjExMzE5NWNhZmIxYTI3NWM4YWZmN2ZlMDgwZmIyNDEzQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20"
    >
      Subscribe to Google Calendar
      <Image
        src="/gcal.png"
        alt="Google Calendar Logo"
        width={24}
        height={24}
        className="ml-3 object-contain"
      />
    </a>
  );
}
