// "use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const LOADING_TIPS = [
  "Click on event cards to see event details",
  "Click on tags to only see events of a certain type",
  "On mobile view, click the yellow button on the bottom right open the filter panel"
];

const Loading = () => {
  // const [randomNumber, setRandomNumber] = useState(0);

  // useEffect(() => {
  //   // const rand = Math.floor(Math.random() * LOADING_TIPS.length);
  //   const rand = new Date().getMinutes() % LOADING_TIPS.length;
  //   setRandomNumber(rand);
  // }, []);

  return (
    <>
      <Image
        src="/loading.gif"
        alt="Loading animation"
        width={100}
        height={100}
        className="mx-auto w-80"
      ></Image>
      <div className="mt-[-4rem] text-center text-5xl font-bold">Loading...</div>
      <div className="mt-2 text-center"> Tip: {LOADING_TIPS[0]} </div>
    </>
  );
};

export default Loading;
