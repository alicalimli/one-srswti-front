import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/hooks/use-redux";
import {
  getUser,
  googleSignIn,
  supabaseSignIn,
} from "@/lib/redux/action/actions-user";
import { IconBrandGoogle } from "@tabler/icons-react";

interface SignInProps {}

export default function SignIn({}: SignInProps) {
  const dispatch = useAppDispatch();
  const [authenticating, setAuthenticating] = useState(false);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (
      event.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      event.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      setAuthenticating(true);

      await dispatch(supabaseSignIn({ email, password }));

      dispatch(getUser());
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <>
      {" "}
      <div className="flex flex-col gap-2 items-center">
        <img
          src="https://api.srswti.com/storage/v1/object/public/srswti_public/medias/srswti-pink-no-title.png"
          alt="Centered Image"
          className="max-w-full h-auto w-24"
        />
        <h1 className="text-3xl font-semibold">Sign in to SRSWTI One</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <form className="grid gap-4" onSubmit={handleAuth}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            className="p-3 text-white rounded-[12px] h-auto bg-primary/20 border border-white/20"
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            className="p-3 text-white rounded-[12px] h-auto bg-primary/20 border border-white/20"
            id="password"
            name="password"
            type="password"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={authenticating}
          className="w-full text-white h-auto p-3 rounded-[12px] "
        >
          {authenticating && <Loader2Icon className="animate-spin mr-2" />}
          Sign in
        </Button>
        <Button
          onClick={() => dispatch(googleSignIn())}
          variant="outline"
          type="button"
          disabled={authenticating}
          className="w-full text-white h-auto p-3 rounded-[12px] "
        >
          {authenticating ? (
            <Loader2Icon className="animate-spin mr-2" />
          ) : (
            <IconBrandGoogle className="mr-3" />
          )}
          Sign in with Google
        </Button>
      </form>
    </>
  );
}
