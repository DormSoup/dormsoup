import { NextAuthProvider } from "./providers";
import { IBM_Plex_Sans } from "next/font/google";

import "./globals.css";
import NavBar from "./NavBar";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

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
      <body className={`${plexSans.variable} font-sans bg-gray-200`}>
        <NextAuthProvider>
          <NavBar />
          <div id="modal-root"></div>
          <div className="mx-auto max-w-3xl pt-[4.5rem] px-4">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
