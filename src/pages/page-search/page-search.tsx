import { ChatPanel } from "./chat-panel";
import ModeDocker from "./mode-docker";

interface PageSearchProps {}

const PageSearch = ({}: PageSearchProps) => {
  return (
    <>
      <ChatPanel />

      <ModeDocker />
    </>
  );
};

export default PageSearch;
