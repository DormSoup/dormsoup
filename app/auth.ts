import { headers } from "next/headers";

export function getAppServerSession(request: Request | undefined = undefined) {
  if (process.env.DORMSOUP_DEV)
    return { user: { name: "Test User", email: "dormsoup-dev@mit.edu" } };
  const hdrs = request === undefined ? headers() : request.headers;
  const name = hdrs.get("nickname");
  const email = hdrs.get("eppn");
  if (!name || !email) return null;
  return { user: { name, email } };
}

