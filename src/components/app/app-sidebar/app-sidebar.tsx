import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
// import {
//   reduxClearChatHistory,
//   reduxGetChatHistory,
// } from "@/lib/redux/action/chatActions";
import { getChatReducerState } from "@/lib/redux/slices/chat";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconHistory, IconMessage, IconStar } from "@tabler/icons-react";
import { getReducerAppState } from "@/lib/redux/slices/sliceAppState";

export default function AppSidebar({
  children,
  user,
}: {
  user: User;
  children: ReactNode;
}) {
  const dispatch = useAppDispatch();

  const { reducerChatHistory } = useAppSelector(getChatReducerState);
  const { focusMode } = useAppSelector(getReducerAppState);

  useEffect(() => {
    // dispatch(reduxGetChatHistory(user?.id));
  }, [dispatch, user?.id]);

  const chats = reducerChatHistory;

  const bookmarks = chats?.filter((chat) => chat.bookmarked);
  const unbookmarks = chats?.filter((chat) => !chat.bookmarked);

  const bookmarksLinks = bookmarks.map((c) => ({
    label: c.title,
    href: c.path,
    icon: (
      <IconMessage className="text-neutral-700 dark:text-neutral-200 size-4 opacity-60 flex-shrink-0" />
    ),
  }));

  const chatLinks = unbookmarks.map((c) => ({
    label: c.title,
    href: c.path,
    icon: (
      <IconMessage className="text-neutral-700 dark:text-neutral-200 size-4 opacity-60 flex-shrink-0" />
    ),
  }));

  const links = [
    ...(bookmarks.length > 0
      ? [
          {
            label: "Bookmarks",
            href: "",
            icon: (
              <IconStar className="text-neutral-700 dark:text-neutral-200 size-4 opacity-60 flex-shrink-0" />
            ),
          },
          ...bookmarksLinks,
        ]
      : []),
    {
      label: "Recent Chats",
      href: "",
      icon: (
        <IconHistory className="text-neutral-700 dark:text-neutral-200 size-4 opacity-60 flex-shrink-0" />
      ),
    },
    ...chatLinks,
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        " flex flex-col md:flex-row-reverse bg-primary/20 w-full flex-1 mx-auto border border-white/20 overflow-hidden",
        "h-[100svh]"
      )}
    >
      <div
        className={`duration-500 ${focusMode ? "opacity-20" : "opacity-100"}`}
      >
        {user && (
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className={`justify-between gap-10 px-4 md:relative `}>
              {open && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className=" absolute bottom-4 z-10 w-64 left-1/2 -translate-x-1/2"
                      disabled={chats.length === 0}
                    >
                      Clear History
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your history and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(event) => {
                          event.preventDefault();

                          // dispatch(reduxClearChatHistory(user.id));
                          setOpen(false);
                        }}
                      >
                        {"Clear"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide overflow-x-hidden">
                <div className="flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
            </SidebarBody>
          </Sidebar>
        )}
      </div>

      <div className="flex flex-1">{children}</div>
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <img
        src="https://api.srswti.com/storage/v1/object/public/srswti_public/medias/srswti-pink-no-title.png"
        alt="Centered Image"
        className={cn("max-w-full h-auto w-12 duration-500 step-focus-mode")}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        SRSWTI
      </motion.span>
    </div>
  );
};
