import { LLM_MODES } from "@/lib/data/dataModes";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { getUserState } from "@/lib/redux/slices/user";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChatFadeEnter } from "@/components/ui/chat-fade-enter";
import { ChatInput } from "@/components/app/chat-input/chat-input";
import { ChatPanelLogo } from "./chat-panel-logo";
import { FormEncType, useNavigate } from "react-router-dom";
import { reduxSendQuery } from "@/lib/redux/action/actions-thread";

interface ChatPanelProps {
  messages: UIState;
  query?: string;
  focusMode: boolean;
}

export function ChatPanel({}: ChatPanelProps) {
  const navigate = useNavigate();

  const hoveredMode = useAppSelector((state) => state.appState.hoveredMode);
  const isGenerating = useAppSelector((state) => state.appState.isGenerating);
  const focusMode = useAppSelector((state) => state.appState.focusMode);

  const { nyuStudent, subscription, profile } = useAppSelector(getUserState);

  const dispatch = useAppDispatch();
  const copilotPlaceholder = LLM_MODES.find((l) => l.id === hoveredMode);

  const placeholder = focusMode && copilotPlaceholder?.placeholder;

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const dontAllowSearch =
    focusMode && !subscription?.is_subscribed && !nyuStudent;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const initialQuery = inputRef?.current?.value;

    if (!initialQuery) return;

    // if (dontAllowSearch) {
    //   try {
    //     const response = await fetch("/api/search-limit");
    //     const data = await response.json();

    //     if (!data.accessible) {
    //       dispatch(setAppStateReducer({ showBilling: true }));
    //       return;
    //     }
    //   } catch (e) {
    //     console.log(e);
    //     return toast.error(
    //       "Something wen't wrong while processing your request."
    //     );
    //   }
    // }

    try {
      dispatch(reduxSendQuery(initialQuery));
      navigate("/thread");
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 3) return "Happy late night";
    if (hour < 6) return "Happy early morning";
    if (hour < 12) return "Good morning";
    if (hour < 15) return "Good afternoon";
    if (hour < 19) return "Good evening";
  };

  const greeting = getTimeOfDay();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={"chat"}
        initial={{ y: "20%", scale: 0.85 }}
        animate={{ y: "0%", scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0 }}
        className={"flex flex-col gap-12 z-10"}
      >
        {" "}
        <div className="flex flex-col gap-2 items-center justify-center mt-24">
          <ChatPanelLogo focusMode={focusMode} />
          {!focusMode && (
            <ChatFadeEnter key="greeting">
              <h1 className="text-3xl md:text-5xl text-white/90 text-center mx-auto font-medium leading-[1.2]">
                {greeting},
                <span className="capitalize">
                  {" "}
                  {profile?.firstName || "Anon"}
                </span>
              </h1>
            </ChatFadeEnter>
          )}
        </div>
        <div>
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto w-full px-6"
          >
            <motion.div layout>
              <ChatInput
                focusMode={focusMode}
                isGenerating={isGenerating}
                inputRef={inputRef}
                placeholder={placeholder || ""}
              />
            </motion.div>

            <div />
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
