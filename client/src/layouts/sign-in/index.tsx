import { useForm } from "react-hook-form";
import { StreamifyLogo } from "../../assets/streamify-logo.svg";
import { useAuth } from "../../hooks/useAuth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sign } from "crypto";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const signInFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export function SignInLayout() {
  const { signIn, isAuthenticated, isSignInError, isLoadingSignIn } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
  });

  const submit = (data: SignInFormSchema) => signIn(data);

  useEffect(() => {
    if(isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated]);

  return (
    <main className="bg-gradient-purple text-stf-purple-800 flex flex-col items-center justify-center w-full h-svh gap-5">
      <StreamifyLogo size={60} />
      <form onSubmit={handleSubmit(submit)} className="bg-white rounded-xl stf-shadow">
        <div className="px-8 py-8 flex flex-col gap-4">
          <p className="text-xl text-center">Sign In</p>
          <div className="flex flex-col text-sm gap-1">
            <label>Username</label>
            <input
              {...register("username")}
              type="text"
              placeholder="Type here..."
              className={`${isSignInError ? "border-red-500" : "border-stf-purple-800"} w-64 bg-white border rounded px-4 py-2 outline-none text-xs`}
            />
          </div>
          <div className="flex flex-col text-sm gap-1">
            <label>Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Type here..."
              className={`${isSignInError ? "border-red-500" : "border-stf-purple-800"} w-64 bg-white border rounded px-4 py-2 outline-none text-xs`}
            />
          </div>
          {isSignInError && <p className="text-xs text-red-500">Invalid credentials</p>}
        </div>
        <button disabled={isLoadingSignIn} className={`${isLoadingSignIn ? "bg-stf-purple-800 cursor-not-allowed" : ""} text-sm bg-stf-purple-600 text-white rounded-b-lg w-full px-4 py-3`}>
          Sign In
        </button>
      </form>
    </main>
  );
}
