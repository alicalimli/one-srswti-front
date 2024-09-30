import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { signOut } from "@/lib/redux/action/actions-user";
import { useState } from "react";

const AccountSettings = ({}) => {
  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();
  const [username, setUsername] = useState(user?.user_metadata?.username || "");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">Your account details</p>
      </div>
      <Separator />

      <div className="flex flex-col gap-2">
        <h6 className="text-sm font-medium">Username</h6>

        <div className="bg-secondary !rounded-[8px] p-3 px-5 opacity-50">
          {username}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h6 className="text-sm font-medium">Your Email</h6>
        <div className="bg-secondary !rounded-[8px] p-3 px-5 opacity-50">
          {user?.email}
        </div>
      </div>

      <Button onClick={() => dispatch(signOut())} variant="destructive">
        Sign Out
      </Button>
    </div>
  );
};

export default AccountSettings;
