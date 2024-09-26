import { useEffect, useState } from "react";
import SignIn from "./signin";
import SignUp from "./signup";
import Wallpaper from "./wallpaper";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/lib/hooks/use-redux";
import { getUserState } from "@/lib/redux/slices/user";

const PageAuth = () => {
  const [page, setPage] = useState("signin");
  const { user } = useAppSelector(getUserState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    navigate("/search");
  }, [navigate, user]);

  if (user) return <></>;

  return (
    <div className="auth-container">
      <main className="sm:p-4 h-[100svh]">
        <div className="w-full h-full flex gap-4 rounded-[16px] overflow-hidden ">
          <div className="flex  items-center justify-center p-6 w-full max-w-4xl sm:p-12  h-full border border-white/10 rounded-[16px]">
            <div className="mx-auto grid w-full max-w-lg gap-6">
              {page === "signin" && <SignIn />}
              {page === "signup" && <SignUp />}
            </div>
          </div>
          <div className="hidden bg-black/50 lg:block rounded-[16px]">
            <Wallpaper />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PageAuth;
