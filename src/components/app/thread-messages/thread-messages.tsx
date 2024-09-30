import { ThreadMessageGroupType } from "@/lib/types";
import SearchSection from "./search-results/search-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MarkdownMessage from "./markdown-message/markdown-message";
import { memo, useEffect, useState } from "react";

interface ThreadMessageProps {
  messageGroup: ThreadMessageGroupType;
  groupIndex: number;
}

const ThreadMessage = ({ messageGroup, groupIndex }: ThreadMessageProps) => {
  const [open, setOpen] = useState("item-1");

  return (
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
            switch (message.type) {
              case "knowledge-graph": {
                if (typeof message.content === "string") return <></>;

                return (
                  <SearchSection
                    searchResults={message.content}
                    query={messageGroup.transformedQuery}
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
                return (
                  <div key={`message-${groupIndex}-${messageIndex}`}>
                    Unknown message type
                  </div>
                );
            }
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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

  return <div>{renderMessages()}</div>;
};

export default ThreadMessages;
