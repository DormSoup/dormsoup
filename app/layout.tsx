import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";

import BottomBar from "./components/BottomBar";
import FilterButton from "./components/FilterButton";
import Modal from "./components/Modal";
import NavBar from "./components/NavBar";
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
  title: "DormSoup",
  description: "Project DormSoup beta testing..."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-9EZM4J8FGP" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-9EZM4J8FGP');
        `}
      </Script>
      <body className={`${plexSans.variable} relative min-h-screen bg-gray-200 font-sans`}>
        <NextAuthProvider>
          <NavBar />
          <FilterButton />
          <Modal />
          <div className="mx-auto px-4 pb-[5rem] pt-[5rem]">{children}</div>
          <BottomBar />
        </NextAuthProvider>
      </body>
    </html>
  );
}
