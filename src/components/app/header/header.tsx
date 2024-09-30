import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAppSelector } from "@/lib/hooks/use-redux";
import { getReducerAppState } from "@/lib/redux/slices/sliceAppState";
import { getUserState } from "@/lib/redux/slices/user";
import SignIn from "@/pages/page-auth/signin";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const { user, nyuStudent } = useAppSelector(getUserState);
  const { isGenerating } = useAppSelector(getReducerAppState);

  const [showSignin, setShowSignin] = useState(false);

  useEffect(() => {
    if (user) {
      setShowSignin(false);
    }
  }, [user]);

  return (
    <header className="w-full p-4 border-b border-white/10  z-50 flex items-center ">
      <button
        disabled={isGenerating}
        onClick={() => navigate("/search")}
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

      {!user && (
        <Button onClick={() => setShowSignin(true)} variant="ghost">
          Sign In
        </Button>
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
