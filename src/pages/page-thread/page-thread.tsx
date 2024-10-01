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
import {
  reduxBookmarkThread,
  reduxGetExistingThread,
} from "@/lib/redux/action/actions-thread";
import { Button } from "@/components/ui/button";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import ChatSharePublic from "./share-button";

const PageThread = () => {
  const navigate = useNavigate();

  const {
    bookmarked,
    id: threadID,
    shared,
    messageGroups,
  } = useAppSelector(getThreadState);

  const { threadID: existingThreadID } = useParams<{ threadID: string }>();
  const { status } = useAppSelector(getThreadState);

  const dispatch = useAppDispatch();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const initializeThread = () => {
      // Existing thread means user opened a thread from the thread list not new threa

      if (existingThreadID) {
        dispatch(reduxGetExistingThread(existingThreadID));
        return;
      }

      if (!threadID) {
        navigate("/search");
      }
    };

    initializeThread();

    return () => {
      dispatch(clearThread());
    };
  }, [dispatch, existingThreadID, navigate, threadID]);

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
        input.value = "";
      }, 0);
    } catch (e) {
      console.log(e);
    }
  }

  const loading = status === "generating" || status === "fetching";

  return (
    <article className="w-full max-w-4xl mx-auto p-4 mt-6 ">
      {status !== "fetching" && (
        <ThreadMessages messageGroups={messageGroups} />
      )}
      {loading && (
        <div className="mt-4">
          <WritingSkeleton />
        </div>
      )}

      {threadID && (
        <div className="absolute flex items-center top-4 right-4 z-40">
          <ChatSharePublic chatID={threadID} shared={shared} />

          <Button
            onClick={async () => {
              await dispatch(reduxBookmarkThread());
            }}
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white"
          >
            {bookmarked ? (
              <IconBookmarkFilled className="w-5 h-5" />
            ) : (
              <IconBookmark className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="absolute left-1/2 -translate-x-1/2 bottom-3 z-50 w-[95svw]  max-w-4xl "
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
