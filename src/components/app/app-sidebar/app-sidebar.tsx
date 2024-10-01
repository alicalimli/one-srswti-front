import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import {
  reduxClearChatHistory,
  // reduxClearChatHistory,
  reduxGetChatHistory,
} from "@/lib/redux/action/actions-user-threads";
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
import {
  IconArrowLeft,
  IconCreditCard,
  IconHelpCircle,
  IconHistory,
  IconMessage,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";
import { setAppStateReducer } from "@/lib/redux/slices/slice-app-state";
import { ProfileType } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AppSettings from "@/components/app/header/settings";
import { useTour } from "@reactour/tour";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function AppSidebar({
  children,
  user,
  profile,
}: {
  profile: ProfileType;
  user: User;
  children: ReactNode;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const reducerChatHistory = useAppSelector(
    (state) => state.chat.reducerChatHistory
  );
  const focusMode = useAppSelector((state) => state.appState.focusMode);
  const [currentPage, setCurrentPage] = useState<
    "home" | "bookmarks" | "shared" | "history"
  >("home");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getChats = async () => {
      if (currentPage !== "home") {
        try {
          !reducerChatHistory?.length && setLoading(true);
          await dispatch(reduxGetChatHistory(user?.id));
        } catch (error) {
          console.error("Error fetching chat history:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getChats();
  }, [currentPage, dispatch, user?.id]);

  const chats = reducerChatHistory;

  const bookmarks = chats?.filter((chat) => chat.bookmarked);
  const shared = chats?.filter((chat) => chat.shared);
  const history = chats?.filter((chat) => !chat.bookmarked && !chat.shared);

  const getLinksForCurrentPage = () => {
    const links = {
      bookmarks: bookmarks.map((c) => ({
        label: c.title,
        href: `/thread/${c.id}`,
        icon: (
          <IconStar className="text-neutral-700 dark:text-neutral-200 size-4 opacity-60 flex-shrink-0" />
        ),
      })),
      shared: shared.map((c) => ({
        label: c.title,
        href: `/thread/${c.id}`,
        icon: (
          <IconMessage className="text-neutral-700 dark:text-neutral-200 size-4 opacity-60 flex-shrink-0" />
        ),
      })),
      history: history.map((c) => ({
        label: c.title,
        href: `/thread/${c.id}`,
        icon: (
          <IconMessage className="text-neutral-700 dark:text-neutral-200 size-4 opacity-60 flex-shrink-0" />
        ),
      })),
    };

    return links[currentPage] || [];
  };

  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { setIsOpen } = useTour();

  return (
    <div
      className={cn(
        " flex flex-col md:flex-row-reverse bg-primary/20 w-full flex-1 mx-auto border border-white/20 overflow-hidden ",
        "h-[100svh]"
      )}
    >
      <Dialog open={showSettings && user} onOpenChange={setShowSettings}>
        <DialogContent className="!w-[90%] md:p-12 md:pt-10 max-w-5xl min-h-[40rem] overflow-hidden">
          <AppSettings />
          <div className="h-8"></div>
        </DialogContent>
      </Dialog>

      <div
        className={`duration-500 ${focusMode ? "opacity-10" : "opacity-100"}`}
      >
        {user && (
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody
              className={`justify-between gap-10 px-4 md:relative z-10`}
            >
              {currentPage === "history" && open && (
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

                          navigate("/search");
                          dispatch(reduxClearChatHistory());
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
                  {currentPage !== "home" ? (
                    <>
                      {loading ? (
                        <div className="flex flex-col gap-2">
                          {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton key={index} className="h-6 w-full mb-1" />
                          ))}
                        </div>
                      ) : (
                        <>
                          <SidebarLink
                            onClick={() => setCurrentPage("home")}
                            hideIcon={true}
                            link={{
                              label: "Back",
                              href: "",
                              icon: (
                                <IconArrowLeft className="opacity-80 size-4 ml-1" />
                              ),
                            }}
                          />
                          {getLinksForCurrentPage().length > 0 ? (
                            getLinksForCurrentPage().map((link, idx) => (
                              <SidebarLink
                                key={idx}
                                link={link}
                                hideIcon={true}
                              />
                            ))
                          ) : (
                            <SidebarLink
                              link={{
                                label: `  No ${currentPage} available`,
                                href: "",
                                icon: <></>,
                              }}
                              className="text-center text-gray-500 mt-4"
                            ></SidebarLink>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <div>
                      <SidebarLink
                        link={{
                          label:
                            user?.email ||
                            profile?.firstName + " " + profile?.lastName,
                          href: "",
                          icon: (
                            <Avatar className="size-8">
                              <AvatarImage
                                src={user?.user_metadata?.picture}
                                alt="@shadcn"
                              />
                              <AvatarFallback>
                                {user?.email?.slice(0, 2) || "U"}
                              </AvatarFallback>
                            </Avatar>
                          ),
                        }}
                      />
                      <SidebarLink
                        onClick={() => {
                          dispatch(setAppStateReducer({ showBilling: true }));
                        }}
                        link={{
                          label: "Billing",
                          href: "",
                          icon: (
                            <IconCreditCard className="opacity-80 size-5 ml-1" />
                          ),
                        }}
                      />
                      <SidebarLink
                        onClick={() => setCurrentPage("bookmarks")}
                        link={{
                          label: "Bookmarks",
                          href: "",
                          icon: <IconStar className="opacity-80 size-5 ml-1" />,
                        }}
                      />
                      <SidebarLink
                        onClick={() => setCurrentPage("shared")}
                        link={{
                          label: "Shared",
                          href: "",
                          icon: (
                            <IconMessage className="opacity-80 size-5 ml-1" />
                          ),
                        }}
                      />
                      <SidebarLink
                        onClick={() => setCurrentPage("history")}
                        link={{
                          label: "Chat History",
                          href: "",
                          icon: (
                            <IconHistory className="opacity-80 size-5 ml-1" />
                          ),
                        }}
                      />
                      <SidebarLink
                        onClick={() => {
                          setIsOpen(true);
                        }}
                        link={{
                          label: "Tutorial",
                          href: "",
                          icon: (
                            <IconHelpCircle className="opacity-80 size-5 ml-1" />
                          ),
                        }}
                      />
                      <SidebarLink
                        onClick={() => {
                          setShowSettings(true);
                        }}
                        link={{
                          label: "Settings",
                          href: "",
                          icon: (
                            <IconSettings className="opacity-80 size-5 ml-1" />
                          ),
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </SidebarBody>
          </Sidebar>
        )}
      </div>

      <div className="flex flex-1 relative">{children}</div>
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
