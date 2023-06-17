"use client";

import { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store1 } from "./store";

export const NextAuthProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store1}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
};
