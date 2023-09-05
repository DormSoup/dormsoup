import { useEffect } from "react";
import { useSelector } from "react-redux";

import { toggleSubscribe } from "../redux/searchSlice";
import { getIsSubscribed } from "../redux/searchSlice";
import { RootState, useAppDispatch } from "../redux/store";

const SubscribeButton = () => {
  const dispatch = useAppDispatch();
  const subscribed = useSelector((state: RootState) => state.search.subscribed);

  useEffect(() => {
    dispatch(getIsSubscribed());
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      <button
        className={
          "rounded-md border-2 border-black px-4 text-white shadow-md hover:opacity-70 hover:shadow-xl " +
          (!subscribed ? " bg-logo-yellow" : " bg-gray-400")
        }
        onClick={() => {
          dispatch(toggleSubscribe());
          alert(
            !subscribed
              ? "Subscribed!\nWe will send you a daily email about events on the second day.\nYou can unsubcribe anytime by clicking the same button."
              : "Unsubscribed.\nWe are sorry to see you go!\nYou can tell us how we could do better by emailing dormsoup@mit.edu"
          );
        }}
      >
        {subscribed == undefined
          ? "Loading Subscription Status..."
          : (!subscribed ? "Subscribe to" : "Unsubscribe from") + " Daily DormScoop"}
      </button>
      <div className="text-sm"> Tomorrow&apos;s Events Delivered to You via Email </div>
    </div>
  );
};

export default SubscribeButton;
