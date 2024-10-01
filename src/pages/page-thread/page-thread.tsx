import { ChatInput } from "@/components/app/chat-input/chat-input";
import ThreadMessages from "@/components/app/thread-messages/thread-messages";
import { WritingSkeleton } from "@/components/app/writing-skeleton/writing-skeleton";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { reduxSendQuery } from "@/lib/redux/action/actions-thread";
import { getThreadState } from "@/lib/redux/slices/slice-thread";
import { ThreadMessageGroupType } from "@/lib/types";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const PageThread = ({}) => {
  const navigate = useNavigate();

  const { id: threadID, messageGroups } = useAppSelector(getThreadState);
  const { status } = useAppSelector(getThreadState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!threadID) {
      navigate("/search");
    }

    // return () => {
    //   dispatch(clearThread());
    // };
  }, []);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const input = inputRef?.current;

    if (!input || !input.value.trim()?.length) return;

    try {
      const groupChat: ThreadMessageGroupType = {
        id: uuidv4(),
        query: "",
        transformedQuery: "",
        messages: [{ role: "user", content: input.value }],
      };

      dispatch(reduxSendQuery({ query: input.value, messages: [groupChat] }));

      setTimeout(() => {
        navigate("/thread");
        input.value = "";
      }, 0);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <article className="w-full max-w-4xl mx-auto p-4 mt-6 ">
      <ThreadMessages messageGroups={messageGroups} />
      {status === "generating" && (
        <div className="mt-2">
          <WritingSkeleton />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="absolute left-1/2 -translate-x-1/2 bottom-3 z-50 w-[100svw]  max-w-4xl"
      >
        <ChatInput
          inputRef={inputRef}
          actionButtonLabel="Send"
          className=" bg-bg-primary z-10"
          focusMode={false}
          placeholder={"Follow up question"}
          isGenerating={status === "generating"}
        />
      </form>

      <div className="h-32"></div>
    </article>
  );
};

export default PageThread;
