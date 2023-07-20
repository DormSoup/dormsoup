import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { IBM_Plex_Sans } from "next/font/google";

import NavBar from "./components/NavBar";
import "./globals.css";
import { DormSoupProvider } from "./providers";

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

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} bg-gray-200 font-sans`}>
        <DormSoupProvider>
          <NavBar />
          <div className="mx-auto max-w-3xl px-4 pt-[5rem]">{children}</div>
          <div className="mx-auto mt-4 w-full border-t-2 border-gray-300 bg-white py-4 text-center text-gray-800">
            Made with ❤️ by MIT DormSoup Project.{"       "}
            <a href="https://accessibility.mit.edu/" className="pl-4 underline">
              Accessibility
            </a>
          </div>
          {modal}
        </DormSoupProvider>
      </body>
    </html>
  );
}
