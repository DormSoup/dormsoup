/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  async redirects() {
    return [
      {
        source: "/gcal",
        destination:
          "https://calendar.google.com/calendar/u/0?cid=Y18zNjE2MDRhYThlZGRjNGJlMTA0NmI0ZmJmODNhYmZkYjExMzE5NWNhZmIxYTI3NWM4YWZmN2ZlMDgwZmIyNDEzQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
