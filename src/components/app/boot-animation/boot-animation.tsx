import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { getUser } from "@/lib/redux/action/userActions";
import { getSharedState } from "@/lib/redux/slices/shared";
import { getUserState } from "@/lib/redux/slices/user";
import { AnimatePresence, motion } from "framer-motion";

import React, { ReactNode, useEffect, useState } from "react";
import VideoPlayer from "@/components/ui/video-player";
import { BackgroundGradientAnimation } from "@/components/ui/bg-gradient";
import Billing from "@/components/app/billing-dialog/billing-dialog";
import AppSidebar from "../app-sidebar/app-sidebar";

// const Onboarding = dynamic(() => import("@/components/onboarding/onboarding"), {
//   ssr: false,
// });

interface BootAnimation {
  children: ReactNode;
}

export default function BootAnimation({ children }: BootAnimation) {
  const { isAnonymous, nyuStudent, user } = useAppSelector(getUserState);

  const { sharedRequest } = useAppSelector(getSharedState);

  const dispatch = useAppDispatch();

  const authenticating = sharedRequest.includes("GET_REQUEST");

  const showChildren = isAnonymous !== null;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getUser());
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {" "}
      <Billing />
      <AnimatePresence>
        {!showChildren && (
          <motion.div
            className="inset-0 absolute bg-black flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VideoPlayer
              src="https://api.srswti.com/storage/v1/object/public/srswti-one-public/bg-windows.mp4?t=2024-09-25T16%3A07%3A00.140Z"
              className=" h-[100svh] w-[50svw] object-contain brightness-20"
            />

            <VideoPlayer
              src="https://api.srswti.com/storage/v1/object/public/srswti-one-public/bg-windows.mp4?t=2024-09-25T16%3A07%3A00.140Z"
              className=" h-[100svh] w-[50svw] object-contain brightness-20 scale-x-[-1]"
            />

            <span className="absolute right-6 top-6 text-black uppercase font-mono text-sm animate-pulse">
              [SRSWTI is booting]
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {showChildren && !authenticating && (
        <AppSidebar user={user}>
          <motion.div
            initial={{ opacity: 0 }}
            className="w-full h-full"
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* {user && <Onboarding />} */}
            <BackgroundGradientAnimation>
              <motion.div
                className={`absolute duration-1000 z-10 inset-0 flex ${
                  nyuStudent ? "bg-[#4D1473]/60" : "bg-black/70"
                }`}
                initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                animate={{ backdropFilter: "blur(40px)", opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                {children}
              </motion.div>
            </BackgroundGradientAnimation>
          </motion.div>
        </AppSidebar>
      )}
    </>
  );
}
