import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import { getUser, googleSignIn, signIn } from "@/lib/redux/action/userActions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { getSharedState } from "@/lib/redux/slices/shared";
import { IconBrandGoogle } from "@tabler/icons-react";

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpProps {}

export default function SignUp({}: SignUpProps) {
  const dispatch = useAppDispatch();

  const { sharedRequest } = useAppSelector(getSharedState);

  const googleLoading = sharedRequest.includes("GOOGLE_SIGN_IN");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      // await dispatch(signUp(data.email, data.password));

      dispatch(getUser());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 items-center">
        <img
          src="https://api.srswti.com/storage/v1/object/public/srswti_public/medias/srswti-pink-no-title.png"
          alt="Centered Image"
          className="max-w-full h-auto w-24"
        />
        <h1 className="text-3xl font-semibold">Create an account</h1>
        <p className="text-balance text-muted-foreground">
          Please fill in the details to create your account
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            className="p-3 text-white rounded-[12px] h-auto bg-primary/20 border border-white/20"
            id="email"
            type="email"
            placeholder="m@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            className="p-3 text-white rounded-[12px] h-auto bg-primary/20 border border-white/20"
            id="password"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            {...register("confirmPassword")}
            className="p-3 text-white rounded-[12px] h-auto bg-primary/20 border border-white/20"
            id="confirmPassword"
            type="password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white h-auto p-3 rounded-[12px]"
        >
          {isSubmitting && <Loader2Icon className="animate-spin mr-2" />}
          Sign Up
        </Button>

        <Button
          onClick={() => dispatch(googleSignIn())}
          variant="outline"
          type="button"
          disabled={googleLoading}
          className="w-full text-white h-auto p-3 rounded-[12px] "
        >
          {googleLoading ? (
            <Loader2Icon className="animate-spin mr-2" />
          ) : (
            <IconBrandGoogle className="mr-3" />
          )}
          Sign up with Google
        </Button>
      </form>
    </>
  );
}
