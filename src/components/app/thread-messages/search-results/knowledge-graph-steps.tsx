import React, { useRef } from "react";
import { CheckIcon } from "lucide-react";
import { getRandomAnalysisSteps } from "@/lib/utils/get-random-analysis-step";

interface AccordionHeaderProps {
  activeTimelineIndex: number;
  query: string;
  pending: boolean;
}

const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  activeTimelineIndex,
  query,
  pending,
}) => {
  const stepsRef = useRef(getRandomAnalysisSteps());
  const steps = stepsRef.current;

  return (
    <header className="flex flex-col gap-2 items-start">
      {pending ? (
        <span className="text-sm mb-1 animate-pulse">
          Searching for {query}
        </span>
      ) : (
        <span className="text-sm mb-1">Searched for {query}</span>
      )}
      {steps.map((s) => (
        <div
          key={s.id}
          className="text-xs font-light gap-2 opacity-60 flex items-center"
        >
          {s.id === activeTimelineIndex ? (
            <>
              <span className="relative flex size-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-3 bg-sky-500"></span>
              </span>
              <span className="text-green-400 font-semibold"> {s.message}</span>
            </>
          ) : (
            <>
              <div className={`bg-black/50 p-0.5 rounded-full`}>
                <CheckIcon
                  className={`size-2 ${
                    s.id >= activeTimelineIndex ? "opacity-0" : ""
                  }`}
                />
              </div>
              {s.message}
            </>
          )}
        </div>
      ))}
    </header>
  );
};

export default AccordionHeader;
