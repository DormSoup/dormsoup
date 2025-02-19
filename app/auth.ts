import { headers } from "next/headers";

export async function getAppServerSession(request: Request | undefined = undefined) {
  if (process.env.DORMSOUP_THUMBNAIL)
    return { user: { name: "DormSoup Thumbnailer", email: "dormsoup-thumbnail@mit.edu" } };
  if (process.env.DORMSOUP_DEV)
    return { user: { name: "Test User", email: "dormsoup-dev@mit.edu" } };
  const hdrs = await (request === undefined ? headers() : Promise.resolve(request.headers));
  const name = hdrs.get("nickname");
  const email = hdrs.get("eppn");
  if (!name || !email) return null;
  return { user: { name, email } };
}

export function isAdmin(user: string): boolean {
  return (
    user === "macy404@mit.edu" || user === "andiliu@mit.edu" || user === "dormsoup-dev@mit.edu" 
    || user === "aabreu@mit.edu" || user === "jazsolan@mit.edu" || user === "danayim@mit.edu"
    || user === "t11s@mit.edu"
  );
}
