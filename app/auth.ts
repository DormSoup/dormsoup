import { headers } from "next/headers";

export function getAppServerSession(request: Request | undefined = undefined) {
  if (process.env.DORMSOUP_THUMBNAIL)
    return { user: { name: "DormSoup Thumbnailer", email: "dormsoup-thumbnail@mit.edu" } };
  if (process.env.DORMSOUP_DEV)
    return { user: { name: "Test User", email: "dormsoup-dev@mit.edu" } };
  const hdrs = request === undefined ? headers() : request.headers;
  const name = hdrs.get("nickname");
  const email = hdrs.get("eppn");
  if (!name || !email) return null;
  return { user: { name, email } };
}

export function isAdmin(user: string): boolean {
  return (
    user === "macy404@mit.edu" || user === "andiliu@mit.edu" || user === "dormsoup-dev@mit.edu" 
    || user === "aabreu@mit.edu"
  );
}
