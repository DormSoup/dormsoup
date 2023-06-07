import { OAuthConfig } from "next-auth/providers/oauth";

const MITAuthConfig: OAuthConfig<any> = {
  id: "mit",
  name: "MIT",
  type: "oauth",
  wellKnown: "https://oidc.mit.edu/.well-known/openid-configuration",
  authorization: { params: { scope: "openid phone email address profile" } },
  profile(profile) {
    console.log(profile);
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },
};

export const AuthOptions = {
  providers: [MITAuthConfig],
};