
"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SignInForm =()=> {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { refetch } = useSession();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const safeCallbackUrl =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";

  const registerUrl = callbackUrl
    ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/register";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error || !data) {
        toast.error(error?.message || "Invalid email or password.");
        return;
      }

      toast.success("Signed in successfully!");

      await refetch();

      window.location.href = safeCallbackUrl;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async () => {
    setSocialLoading(true);

    try {
      sessionStorage.setItem("showSocialToast", "1");

      const { error } = await authClient.signIn.social({
        provider: "google",
      });

      if (error) {
        sessionStorage.removeItem("showSocialToast");
        toast.error("An error occurred during Google sign-in.");
      }
    } catch {
      sessionStorage.removeItem("showSocialToast");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090d] px-4 py-10 text-white">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[130px]" />

      <div className="relative z-10 w-full max-w-[420px]">

        {/* Brand */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/20">
            H
          </div>

          <span className="text-xl font-bold tracking-tight">
            Hire<span className="text-blue-500">Loop</span>
          </span>
        </Link>

        {/* Sign in card */}
        <Card className="overflow-hidden border border-[#252832] bg-[#101116] shadow-2xl shadow-black/30">

          <CardContent className="p-7 sm:p-9">

            {/* Header */}
            <div className="mb-7">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5">
                <span className="size-1.5 rounded-full bg-blue-400" />

                <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                  Secure Member Access
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-[#8b909e]">
                Sign in to access your HireLoop workspace.
              </p>

            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">

                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-[#d5d7df]"
                >
                  Email address
                </Label>

                <div className="relative">

                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#707789]" />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="h-11 border-[#292d38] bg-[#171920] pl-10 text-sm text-white placeholder:text-[#666c7a] focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />

                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">

                <div className="flex items-center justify-between">

                  <Label
                    htmlFor="password"
                    className="text-xs font-medium text-[#d5d7df]"
                  >
                    Password
                  </Label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#707789]" />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-11 border-[#292d38] bg-[#171920] pl-10 pr-11 text-sm text-white placeholder:text-[#666c7a] focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-[#777d8b] hover:bg-transparent hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>

                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2">

                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                    className="border-[#444958] data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                  />

                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-xs text-[#9297a4]"
                  >
                    Keep me signed in
                  </Label>

                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#737989]">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  Secure login
                </div>

              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || socialLoading}
                className="h-11 w-full bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in to HireLoop
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <Separator className="flex-1 bg-[#292d38]" />

                <span className="text-[10px] font-medium uppercase tracking-widest text-[#707687]">
                  Or continue with
                </span>

                <Separator className="flex-1 bg-[#292d38]" />
              </div>

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                disabled={loading || socialLoading}
                onClick={handleSocialSignIn}
                className="h-11 w-full border-[#303440] bg-[#171920] text-sm font-medium text-[#e1e3e9] transition hover:border-[#464c5c] hover:bg-[#20232c] hover:text-white"
              >
                <FcGoogle className="mr-2 size-4" />

                {socialLoading
                  ? "Connecting..."
                  : "Continue with Google"}
              </Button>

            </form>

            {/* Register */}
            <div className="mt-7 text-center text-xs text-[#858b99]">
              Dont have an account?{" "}

              <Link
                href={registerUrl}
                className="font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Create an account
              </Link>
            </div>

          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-[#555b69]">
          © {new Date().getFullYear()} HireLoop. All rights reserved.
        </p>

      </div>
    </main>
  );
}

export default SignInForm;

