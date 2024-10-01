import { FloatingDock } from "@/components/ui/floating-dock";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { LLM_MODES } from "@/lib/data/dataModes";
import { setAppStateReducer } from "@/lib/redux/slices/slice-app-state";

export function ModeDocker() {
  const activeMode = useAppSelector((state) => state.appState.activeMode);
  const focusMode = useAppSelector((state) => state.appState.focusMode);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const handleClick = (item) => {
    dispatch(setAppStateReducer({ activeMode: item.id, hoveredMode: item.id }));
    setOpen(false);
  };

  const activeButton = LLM_MODES.find((l) => l.id === activeMode);

  if (!focusMode) return;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 step-mode-picker">
      <AnimatePresence mode="wait">
        {!open && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  key="button-icon"
                  className="flex flex-col gap-1 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={() => setOpen(true)}
                    size="icon"
                    className="p-1.5"
                  >
                    {activeButton?.icon}
                  </Button>
                  <span className="text-xs opacity-70 capitalize">
                    {activeMode} Mode
                  </span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p></p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {open && (
          <motion.div
            key="dock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <FloatingDock
              active={activeMode}
              handleClick={handleClick}
              items={LLM_MODES.map((link) => ({
                ...link,
                href: "#",
              }))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModeDocker;
