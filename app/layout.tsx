import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { IBM_Plex_Sans } from "next/font/google";

import NavBar from "./NavBar";
import "./globals.css";
import { NextAuthProvider } from "./providers";

config.autoAddCss = false;

const plexSans = IBM_Plex_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--plex-sans-font",
  display: "swap"
});

export const metadata = {
  title: "Dormsoup",
  description: "Project Hakken beta testing..."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} bg-gray-200 font-sans`}>
        <NextAuthProvider>
          <NavBar />
          <div className="mx-auto max-w-3xl px-4 pt-[4.5rem]">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
