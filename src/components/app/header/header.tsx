"use client";

import SignIn from "@/app/(auth)/signin/signin";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { signOut } from "@/lib/redux/action/userActions";
import { getUserState } from "@/lib/redux/slices/user";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
// import { useAIActions } from '@/lib/hooks/use-ai-actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BookOpen, DollarSign, LogOutIcon, Settings } from "lucide-react";
import {
  getReducerAppState,
  setAppStateReducer,
} from "@/lib/redux/slices/sliceAppState";
import { useTour } from "@reactour/tour";

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, nyuStudent } = useAppSelector(getUserState);
  const { setIsOpen } = useTour();

  const [showSignin, setShowSignin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { isGenerating } = useAppSelector(getReducerAppState);
  // const { clearMessages } = useAIActions()

  useEffect(() => {
    if (user) {
      setShowSignin(false);
    }
  }, [user]);

  return (
    <header className="w-full p-4 border-b border-white/10  z-50 flex items-center ">
      <button
        disabled={isGenerating}
        onClick={() => {
          // clearMessages()
          // router.push('http://localhost:3000/search/qYxR3tm')
        }}
        className="duration-300 hover:opacity-50"
      >
        {nyuStudent ? (
          <img
            src="https://api.magicnotes.app/storage/v1/object/public/srswti-one/images/srswti-nyu.png"
            alt="Centered Image"
            className="w-48 [animation-duration:1.5s]"
          />
        ) : (
          <h3 className="text-xl font-semibold">SRSWTI ONE</h3>
        )}
      </button>

      <div className="ml-auto"></div>

      {!user ? (
        <Button onClick={() => setShowSignin(true)} variant="ghost">
          Sign In
        </Button>
      ) : (
        <div className="flex gap-2 items-center">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent className="!w-[90%] md:p-12 md:pt-10 max-w-5xl min-h-[40rem] overflow-hidden">
              <AppSettings />

              <div className="h-8"></div>
            </DialogContent>
          </Dialog>

          <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
            <DropdownMenuTrigger>
              <button className="profile-btn-step">
                <Avatar>
                  <AvatarImage
                    src={user?.user_metadata?.picture}
                    alt="@shadcn"
                  />
                  <AvatarFallback>
                    {user?.email?.slice(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-[8rem]">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  setShowSettings(true);
                  setShowDropdown(false);
                }}
              >
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  dispatch(setAppStateReducer({ showBilling: true }));
                  setShowDropdown(false);
                }}
              >
                <DollarSign className="size-4" />
                Billing
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  setIsOpen(true);
                  setShowDropdown(false);
                }}
              >
                <BookOpen className="size-4" />
                Tutorial
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  dispatch(signOut());
                  setShowDropdown(false);
                }}
              >
                <LogOutIcon className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <Dialog open={showSignin} onOpenChange={setShowSignin}>
        <DialogContent className="bg-black/40 backdrop-blur-lg p-6 sm:p-12">
          <div className="mx-auto grid w-full max-w-lg gap-6">
            <SignIn />
          </div>
        </DialogContent>
      </Dialog>

      {/* <ModeToggle /> */}
    </header>
  );
};

export default Header;
