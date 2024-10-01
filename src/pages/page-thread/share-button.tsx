import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/lib/hooks/use-redux";
import { reduxShareThread } from "@/lib/redux/action/actions-thread";
import { Loader2Icon, ShareIcon } from "lucide-react";
import { memo, useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import { toast } from "sonner";

const templates = [
  {
    id: 1,
    message:
      "Just discovered something fascinating with SRSWTI One! The AI-powered search gave me insights I never expected. Want to see what I found?",
  },
  {
    id: 2,
    message:
      "SRSWTI One just blew my mind! I searched for a topic and got such unique perspectives. Curious to hear your thoughts on this!",
  },
  {
    id: 3,
    message:
      "Ever feel like regular search engines don't quite get you? SRSWTI One's AI search just helped me find exactly what I needed. Check it out!",
  },
  {
    id: 4,
    message:
      "Had a great 'aha!' moment thanks to SRSWTI One. Its AI search dug up some really interesting connections. Thought you might find this intriguing too!",
  },
  {
    id: 5,
    message:
      "SRSWTI One is changing how I explore ideas online. Just had a really enlightening search session. Fancy diving into this rabbit hole with me?",
  },
];

interface ShareButtonProps {
  chatID: string;
  shared: boolean;
}

const ChatSharePublic = ({ chatID, shared }: ShareButtonProps) => {
  const dispatch = useAppDispatch();

  const isPublic = shared;
  const link = `${window?.location.origin}/share/${chatID}`;

  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(1);

  const activeTemplate = templates.find((t) => t.id === template);

  const shareTitle = activeTemplate?.message;
  const shareTags = ["MagicNotes", "SRSWTICareer", "Career", "AI"];

  const togglePublish = async () => {
    try {
      setLoading(true);

      await dispatch(reduxShareThread());
    } catch (error) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/80 hover:text-white"
        >
          <ShareIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[30rem] max-w-[100vw] p-4 share-dialog bg-primary/40 backdrop-blur-sm border-white/20">
        <div className="space-y-4">
          {isPublic ? (
            <>
              <p className="text-white/70 text-sm mb-1">Template</p>
              <Select
                value={template.toString()}
                onValueChange={(val) => setTemplate(parseInt(val))}
              >
                <SelectTrigger className="w-full max-w-[28rem] bg-primary/60 border-white/30">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>

                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                      className="max-w-[40rem] h-auto p-4 pl-8"
                    >
                      {template.message}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className=" bg-primary/60 border-white/30 p-4 rounded-[8px]">
                <div className="flex gap-3 justify-center flex-wrap">
                  <TwitterShareButton
                    url={link}
                    hashtags={shareTags}
                    title={shareTitle}
                    size={23}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <XIcon size="32" round />
                  </TwitterShareButton>

                  <FacebookShareButton
                    url={link}
                    title={shareTitle}
                    size={23}
                    hashtags={shareTags}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <FacebookIcon size="32" round />
                  </FacebookShareButton>

                  <LinkedinShareButton
                    url={link}
                    hashtags={shareTags}
                    title={shareTitle}
                    style={{ display: "flex", alignItems: "center" }}
                    size={23}
                  >
                    <LinkedinIcon size="32" round />
                  </LinkedinShareButton>

                  <WhatsappShareButton
                    url={link}
                    hashtags={shareTags}
                    style={{ display: "flex", alignItems: "center" }}
                    title={shareTitle}
                    size={23}
                  >
                    <WhatsappIcon size="32" round />
                  </WhatsappShareButton>

                  <TelegramShareButton
                    url={link}
                    hashtags={shareTags}
                    style={{ display: "flex", alignItems: "center" }}
                    title={shareTitle}
                    size={23}
                  >
                    <TelegramIcon size="32" round />
                  </TelegramShareButton>

                  <RedditShareButton
                    url={link}
                    hashtags={shareTags}
                    style={{ display: "flex", alignItems: "center" }}
                    title={shareTitle}
                    size={23}
                  >
                    <RedditIcon size="32" round />
                  </RedditShareButton>
                </div>
              </div>
              <Input
                className=" bg-primary/60 border-white/30"
                value={link}
                readOnly
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="w-full link-btn"
              >
                Copy link
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-lg">Publish to public</p>
              <p className="text-white/70 text-sm max-w-[18rem]">
                Anyone with your link would be able to check this page.
              </p>
            </div>
          )}

          <Button disabled={loading} onClick={togglePublish} className="w-full">
            {loading && <Loader2Icon className="animate-spin mr-2" size={16} />}
            {isPublic ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(ChatSharePublic);
