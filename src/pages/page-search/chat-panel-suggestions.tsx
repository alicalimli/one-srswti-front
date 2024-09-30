import { WritingSkeleton } from "@/components/app/writing-skeleton/writing-skeleton";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { TextIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ChatQuerySuggestions({
  submitMessage,
  className,
}: {
  submitMessage: (message: string) => void;
  className?: string;
}) {
  const dispatch = useAppDispatch();

  const queries = useAppSelector((state) => state.user.personalizedQueries);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      if (queries.length) return;

      // setLoading(true)
      // await dispatch(reduxGetPersonalizedQueries())
      // setLoading(false)
    };

    fetchQueries();
  }, [queries, dispatch]);

  return (
    <div className={`step-suggestions mx-auto w-[90%] ${className}`}>
      <div className="bg-accent-primary/20 border border-t-0 border-white/20 rounded-b-[24px] p-4">
        <div className="flex flex-col items-start mt-1 w-full relative">
          {" "}
          {loading ? (
            <div className="p-4 w-full">
              <WritingSkeleton />
            </div>
          ) : (
            <>
              {queries.map((q) => (
                <button
                  key={q}
                  className="h-auto p-2 px-4 rounded-lg text-base flex text-start items-center gap-1 hover:bg-white/10 hover:text-pink-600 duration-150 w-full"
                  name={q}
                  onClick={async () => {
                    submitMessage(q);
                  }}
                >
                  <TextIcon size={20} className="mr-2" />
                  {q}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
