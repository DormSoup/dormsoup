import { AuthOptions } from "next-auth";
import { OAuthConfig } from "next-auth/providers/oauth";

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "mit",
      name: "MIT",
      type: "oauth",
      wellKnown: "https://oidc.mit.edu/.well-known/openid-configuration",

      authorization: { params: { scope: "openid email profile" } },
      // Next Auth claims that it can decode the user info from the ID token, but probably because
      // MIT's OIDC is not that compliant, this doesn't work, and for the actual user info (with
      // email and name) we need to go to the userinfo endpoint. That said, we can't set idToken to
      // be false, because then Next Auth will somehow complain.
      idToken: true,
      // The workaround is to set idToken to true, and then override the request function for
      // userinfo.
      userinfo: {
        async request(context) {
          return await context.client.userinfo(context.tokens.access_token!!);
        }
      },

      clientId: process.env.MIT_CLIENT_ID,
      clientSecret: process.env.MIT_CLIENT_SECRET,

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email
        };
      },

      httpOptions: {
        timeout: 60000
      }
    } as OAuthConfig<any>,
    {
      id: "shimmer",
      name: "MIT Shimmer",
      type: "oauth",
      wellKnown: "https://shimmer.csail.mit.edu/.well-known/openid-configuration",

      authorization: { params: { scope: "openid email profile" } },
      idToken: true,
      userinfo: {
        async request(context) {
          return await context.client.userinfo(context.tokens.access_token!!);
        }
      },

      clientId: process.env.SHIMMER_CLIENT_ID,
      clientSecret: process.env.SHIMMER_CLIENT_SECRET,

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email
        };
      },

      httpOptions: {
        timeout: 60000
      }
    } as OAuthConfig<any>
  ]
};
