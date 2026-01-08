export default function Calendar() {
  return (
    <iframe
      src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&bgcolor=%23e5e7eb&showPrint=0&showTabs=0&showTz=0&showDate=0&showNav=1&showTitle=0&showCalendars=0&src=Y18zNjE2MDRhYThlZGRjNGJlMTA0NmI0ZmJmODNhYmZkYjExMzE5NWNhZmIxYTI3NWM4YWZmN2ZlMDgwZmIyNDEzQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23cc004d&mode=WEEK"
      style={{ height: "calc(100vh - 160px)" }}
      width="100%"
    ></iframe>
  );
}
