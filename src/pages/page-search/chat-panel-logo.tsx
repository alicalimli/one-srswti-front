import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setAppStateReducer } from "@/lib/redux/slices/slice-app-state";
import { useAppDispatch } from "@/lib/hooks/use-redux";

interface ChatPanelLogoProps {
  focusMode: boolean;
}

export function ChatPanelLogo({ focusMode }: ChatPanelLogoProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipLabel, setTooltipLabel] = useState(
    "This is a tooltip label for additional information."
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tooltipOpen) {
      const messages = [
        "SRSWTI ONE FOCUS: Pure intelligence, zero fluff – scans deeper, connects better, instant clarity.",
        "SRSWTI ONE FOCUS:  Sharper. Smarter. Built to dive into more, and more precise than ever.",
        "SRSWTI ONE FOCUS: Get ready – precise reasoning, broader reach, and personalized results.",
      ];
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      setTooltipLabel(randomMessage);
    }
  }, [tooltipOpen]);

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <motion.button
            onClick={() => {
              dispatch(setAppStateReducer({ focusMode: !focusMode }));
            }}
            className={cn(
              "relative duration-700 btn-effect",
              focusMode ? "rotate-180" : "rotate-0"
            )}
          >
            <img
              src="https://api.srswti.com/storage/v1/object/public/srswti_public/medias/srswti-pink-no-title.png"
              alt="Centered Image"
              className={cn(
                "max-w-full h-auto w-24 duration-500 step-focus-mode",
                !focusMode ? "filter invert brightness-0" : ""
              )}
            />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent className="rounded p-4 bg-primary/20 border-white/20">
          <p>{tooltipLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
