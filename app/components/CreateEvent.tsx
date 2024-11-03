"use client";

import { useEffect, useState } from "react";

import { Session } from "../api/auth/session/route";
import { getAppClientSession } from "../authClient";

const CreateEvent = () => {
  const [session, setSession] = useState<Session | undefined>(undefined);
  useEffect(() => {
    getAppClientSession().then(setSession);
  }, []);

  return (
    <a
      className="fixed bottom-10 right-10 z-40 flex h-[3rem] w-[3rem] items-center justify-center rounded-full  bg-logo-yellow text-white shadow-xl transition-all duration-150 hover:-translate-y-0.5 hover:cursor-pointer"
      href={`mailto:${session?.user.email}?bcc=bc-talk@mit.edu, ec-discuss@mit.edu, fraternity-all@mit.edu, macgregor@mit.edu, maseeh-talk@mit.edu, mccormick-announce@mit.edu, nh-forum@mit.edu, new-vassar-forum@mit.edu, next-forum@mit.edu, random-hall-dormspam@mit.edu, sponge-talk@mit.edu&body=%0A%0Abcc%E2%80%99ed%20to%20dorms%2C%20%5Bcolor%5D%20for%20bc-talk%0A%0ASent%20via%20DormSoup`}
    >
      <button>
        <img src="icons/mail-plus.svg" />
      </button>
    </a>
  );
};

export default CreateEvent;
