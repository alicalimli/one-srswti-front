import { ChatInput } from "@/components/app/chat-input/chat-input";
import ThreadMessages from "@/components/app/thread-messages/thread-messages";
import { WritingSkeleton } from "@/components/app/writing-skeleton/writing-skeleton";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { reduxSendQuery } from "@/lib/redux/action/actions-send-query";
import { clearThread, getThreadState } from "@/lib/redux/slices/slice-thread";
import { ThreadMessageGroupType } from "@/lib/types";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { reduxGetExistingThread } from "@/lib/redux/action/actions-thread";

const PageThread = () => {
  const navigate = useNavigate();

  const { id: threadID, messageGroups } = useAppSelector(getThreadState);
  const { threadID: existingThreadID } = useParams<{ threadID: string }>();
  const { status } = useAppSelector(getThreadState);

  const dispatch = useAppDispatch();
  const isAnExistingThread = !!existingThreadID;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (existingThreadID) {
      dispatch(reduxGetExistingThread(existingThreadID));
      return;
    }

    if (!threadID && !isAnExistingThread) {
      navigate("/search");
    }

    return () => {
      dispatch(clearThread());
    };
  }, [existingThreadID]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const input = inputRef?.current;

    if (!input || !input.value.trim()?.length) return;

    try {
      const groupChat: ThreadMessageGroupType = {
        id: uuidv4(),
        query: "",
        transformed_query: "",
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

  const loading = status === "generating" || status === "fetching";

  return (
    <article className="w-full max-w-4xl mx-auto p-4 mt-6 ">
      {status === "idle" && <ThreadMessages messageGroups={messageGroups} />}
      {loading && (
        <div className="mt-4">
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
