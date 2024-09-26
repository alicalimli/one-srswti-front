import React, { useMemo, useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks/use-redux";
import { googleSignIn, signOut } from "@/lib/redux/action/userActions";

interface BillingNyuStepsProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function BillingNyuSteps({
  show,
  setShow,
}: BillingNyuStepsProps) {
  // Start of Selection
  const dispatch = useAppDispatch();

  const loadingStates = useMemo(
    () => [
      {
        text: 'Click the "Sign In with NYU" button below',
      },
      {
        text: "Get redirected to Google Sign In",
      },
      {
        text: "Select your NYU email address",
      },
      {
        text: "Allow SRSWTI to access your email",
      },
      {
        text: (
          <Button
            onClick={() => {
              dispatch(signOut());

              setTimeout(() => {
                dispatch(googleSignIn());
              }, 1000);
            }}
            className="px-8 z-10"
          >
            Sign In with NYU
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="absolute w-full h-[60vh] flex items-center justify-center z-[9999]">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={show} duration={2000} />

      {show && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setShow(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}
