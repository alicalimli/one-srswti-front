import { ThreadMessageGroupType } from "@/lib/types";
import SearchSection from "./search-results/search-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MarkdownMessage from "./markdown-message/markdown-message";
import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copilot } from "./inquire/inquire";

interface ThreadMessageProps {
  messageGroup: ThreadMessageGroupType;
  groupIndex: number;
}

const ThreadMessage = ({ messageGroup, groupIndex }: ThreadMessageProps) => {
  const [open, setOpen] = useState("item-1");

  if (messageGroup?.type === "inquiry" && messageGroup?.inquiry) {
    return <Copilot inquiry={messageGroup?.inquiry} id={messageGroup?.id} />;
  }

  if (!messageGroup?.query) return <></>;

  return (
    <motion.li
      key={messageGroup?.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
    >
      {messageGroup?.type === "inquiry" && messageGroup?.inquiry ? (
        <Copilot inquiry={messageGroup?.inquiry} id={messageGroup?.id} />
      ) : (
        <></>
      )}

      {messageGroup?.query ? (
        <Accordion
          value={open}
          onValueChange={(val) => setOpen(val)}
          type="single"
          collapsible
        >
          <AccordionItem value={`item-1`}>
            <AccordionTrigger className="text-2xl">
              {messageGroup.query}
            </AccordionTrigger>
            <AccordionContent className="space-y-5">
              {messageGroup.messages.map((message, messageIndex) => {
                switch (message.role) {
                  case "knowledge-graph": {
                    if (typeof message.content === "string") return <></>;

                    return (
                      <SearchSection
                        searchResults={message.content}
                        query={messageGroup.transformed_query}
                        key={`message-${groupIndex}-${messageIndex}`}
                      />
                    );
                  }
                  case "text":
                    return (
                      <MarkdownMessage
                        content={message.content as string}
                        key={`message-${groupIndex}-${messageIndex}`}
                      />
                    );
                  default:
                    return <></>;
                }
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </motion.li>
  );
};

const MemoizedThreadMessage = memo(ThreadMessage);

interface ThreadMessagesProps {
  messageGroups: ThreadMessageGroupType[];
}

const ThreadMessages = ({ messageGroups }: ThreadMessagesProps) => {
  const renderMessages = () => {
    return messageGroups.map((messageGroup, groupIndex) => (
      <MemoizedThreadMessage
        key={`thread-message-${groupIndex}`}
        messageGroup={messageGroup}
        groupIndex={groupIndex}
      />
    ));
  };

  return (
    <AnimatePresence>
      <ul className="flex flex-col gap-4">{renderMessages()}</ul>
    </AnimatePresence>
  );
};

export default ThreadMessages;
