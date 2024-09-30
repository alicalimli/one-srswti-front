import { Input } from "@/components/ui/input";

interface ChatProps {}

const Chat = ({}: ChatProps) => {
  return (
    <div className="bg-white/10 p-4 max-w-lg mx-auto mt-64 flex flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input placeholder="Send a message..." />
      </form>
    </div>
  );
};

export default Chat;
