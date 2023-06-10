import NextAuth from "next-auth/next";
import { authOptions } from "@/app/auth";

const handler = NextAuth({
  ...authOptions,
  pages: {
    // Why direct signIn page to /auth/error too? Because the sign in page is used to choose the 
    // auth provider and for our case MIT is the only auth provider we have. The sign in page is 
    // effectively unused in a normal auth flow and only brought up when there is an error.
    signIn: "/auth/error",
    error: "/auth/error",
  }
});
export { handler as GET, handler as POST };
