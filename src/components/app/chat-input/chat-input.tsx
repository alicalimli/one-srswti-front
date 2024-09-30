import { Button } from "@/components/ui/button";
import ShineBorder from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";
import { Loader2Icon, SearchIcon, SparkleIcon } from "lucide-react";
import React from "react";
import Textarea from "react-textarea-autosize";

interface ChatInputProps {
  focusMode?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  className?: string;
  isGenerating?: boolean;
  placeholder?: string;
  actionButtonLabel?: string;
  loading?: boolean;
}

export function ChatInput({
  isGenerating = false,
  inputRef,
  focusMode,
  placeholder,
  className = "",
  actionButtonLabel = "",
}: Readonly<ChatInputProps>) {
  return (
    <div className="relative flex items-center w-full">
      {focusMode && (
        <ShineBorder
          borderWidth={3}
          glowClassName={cn("-z-10")}
          className={cn("rounded-lg h-[110%] w-[101%] -left-1 absolute")}
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <div />
        </ShineBorder>
      )}
      <Textarea
        ref={inputRef}
        name="input"
        rows={1}
        maxRows={6}
        tabIndex={0}
        placeholder={placeholder || "How can SRSWTI help you today?"}
        spellCheck={false}
        disabled={isGenerating}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            const textarea = e.target as HTMLTextAreaElement;
            textarea.form?.requestSubmit();
          }
        }}
        className={cn(
          "resize-none w-full step-search-input z-10 rounded-[24px] backdrop-blur-md duration-200 border border-white/20 text-[16px] p-4 pl-6  pr-32 ring-offset-background placeholder:text-white/60 outline-none scrollbar-hide",
          "!min-h-[64px]",
          focusMode ? "bg-bg-secondary/70" : "bg-bg-secondary/50",
          className
        )}
      />
      <div
        className={cn(
          "absolute right-4 flex gap-1 z-10 transform -translate-y-1/2",
          "top-[32px]"
        )}
      >
        <Button
          type="submit"
          className="rounded-xl text-white gap-2 bg-accent-primary step-search-btn"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2Icon size={20} className="animate-spin" />
            </>
          ) : (
            <>
              {" "}
              <SearchIcon className="sm:hidden" size={18} />
              <SparkleIcon className="hidden sm:block" size={20} />
            </>
          )}
          <span className="hidden sm:block">
            {actionButtonLabel || "Search"}
          </span>
        </Button>
      </div>
    </div>
  );
}
