
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
  UserRound,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SignUpForm = ()=> {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { refetch } = useSession();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const safeCallbackUrl =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";

  const signInUrl = callbackUrl
    ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/signin";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      image: String(formData.get("image") ?? "").trim() || undefined,
    };

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // Name validation
    if (user.name.length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }

    // Email validation
    if (!emailRegex.test(user.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

   // Profile image URL validation
    if (user.image) {
      try {
        new URL(user.image);
      } catch {
        toast.error("Please enter a valid photo URL.");
        return;
      }
    }

    // Password validation
    if (
      user.password.length < 8 ||
      !/[A-Z]/.test(user.password) ||
      !/[0-9]/.test(user.password)
    ) {
      toast.error(
        "Password must be 8+ characters, with 1 uppercase letter and 1 number."
      );
      return;
    }

    // Terms validation
    if (!termsAccepted) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email(user);

      if (error || !data) {
        console.error(error);
        toast.error(error?.message || "Unable to create your account.");
        return;
      }

      toast.success("Account created successfully!");

      await refetch();

      window.location.href = safeCallbackUrl;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async () => {
    setSocialLoading(true);

    try {
      sessionStorage.setItem("showSocialToast", "1");

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: safeCallbackUrl,
      });

      if (error) {
        sessionStorage.removeItem("showSocialToast");
        toast.error("An error occurred during Google sign-up.");
      }
    } catch (error) {
      sessionStorage.removeItem("showSocialToast");
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090d] px-4 py-10 text-white">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[130px]" />

      <div className="relative z-10 w-full max-w-[450px]">

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

        {/* Signup Card */}
        <Card className="overflow-hidden border border-[#252832] bg-[#101116] shadow-2xl shadow-black/30">

          <CardContent className="p-7 sm:p-9">

            {/* Header */}
            <div className="mb-7">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5">
                <span className="size-1.5 rounded-full bg-blue-400" />

                <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                  Join the Community
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-[#8b909e]">
                Join HireLoop and start exploring new opportunities.
              </p>

            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-2">

                <Label
                  htmlFor="name"
                  className="text-xs font-medium text-[#d5d7df]"
                >
                  Full name
                </Label>

                <div className="relative">

                  <UserRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#707789]" />

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={3}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="h-11 border-[#292d38] bg-[#171920] pl-10 text-sm text-white placeholder:text-[#666c7a] focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />

                </div>
              </div>

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

              {/* Profile Image */}
              <div className="space-y-2">

                <div className="flex items-center justify-between">

                  <Label
                    htmlFor="image"
                    className="text-xs font-medium text-[#d5d7df]"
                  >
                    Profile photo URL
                  </Label>

                  <span className="text-[10px] text-[#737989]">
                    Optional
                  </span>

                </div>

                <div className="relative">

                  <ImageIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#707789]" />

                  <Input
                    id="image"
                    name="image"
                    type="text"
                    placeholder="https://example.com/photo.jpg"
                    className="h-11 border-[#292d38] bg-[#171920] pl-10 text-sm text-white placeholder:text-[#666c7a] focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />

                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">

                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-[#d5d7df]"
                >
                  Password
                </Label>

                <div className="relative">

                  <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#707789]" />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
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

                {/* Password Requirements */}
                <div className="space-y-1 pt-1">

                  <p className="text-[10px] text-[#737989]">
                    Password must contain:
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1">

                    <span
                      className={`text-[10px] ${
                        password.length >= 8
                          ? "text-emerald-400"
                          : "text-[#737989]"
                      }`}
                    >
                      {password.length >= 8 ? "✓" : "○"} 8+ characters
                    </span>

                    <span
                      className={`text-[10px] ${
                        /[A-Z]/.test(password)
                          ? "text-emerald-400"
                          : "text-[#737989]"
                      }`}
                    >
                      {/[A-Z]/.test(password) ? "✓" : "○"} 1 uppercase letter
                    </span>

                    <span
                      className={`text-[10px] ${
                        /[0-9]/.test(password)
                          ? "text-emerald-400"
                          : "text-[#737989]"
                      }`}
                    >
                      {/[0-9]/.test(password) ? "✓" : "○"} 1 number
                    </span>

                  </div>

                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2 pt-1">

                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked === true)
                  }
                  className="mt-0.5 border-[#444958] data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                />

                <Label
                  htmlFor="terms"
                  className="cursor-pointer text-xs leading-relaxed text-[#9297a4]"
                >
                  I agree to the{" "}

                  <Link
                    href="/terms"
                    className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Terms of Service
                  </Link>

                  {" "}and{" "}

                  <Link
                    href="/privacy"
                    className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Privacy Policy
                  </Link>

                </Label>

              </div>

              {/* Create Account */}
              <Button
                type="submit"
                disabled={loading || socialLoading}
                className="h-11 w-full bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">

                <Separator className="flex-1 bg-[#292d38]" />

                <span className="text-[10px] font-medium uppercase tracking-widest text-[#707687]">
                  Or sign up with
                </span>

                <Separator className="flex-1 bg-[#292d38]" />

              </div>

              {/* Google Signup */}
              <Button
                type="button"
                variant="outline"
                disabled={loading || socialLoading}
                onClick={handleSocialSignUp}
                className="h-11 w-full border-[#303440] bg-[#171920] text-sm font-medium text-[#e1e3e9] transition hover:border-[#464c5c] hover:bg-[#20232c] hover:text-white"
              >
                <FcGoogle className="mr-2 size-4" />

                {socialLoading
                  ? "Connecting..."
                  : "Continue with Google"}
              </Button>

            </form>

            {/* Login Link */}
            <div className="mt-7 text-center text-xs text-[#858b99]">
              Already have an account?{" "}

              <Link
                href={signInUrl}
                className="font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Sign in
              </Link>
            </div>

          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#555b69]">
          <ShieldCheck className="size-3.5" />
          Your information is protected and secure.
        </div>

      </div>
    </main>
  );
}

export default SignUpForm

