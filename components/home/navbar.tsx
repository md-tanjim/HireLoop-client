
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MenuIcon,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";



import { cn } from "@/lib/utils";
import { authClient, useSession } from "@/lib/auth-client";

const navLinks = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/company", label: "Company" },
  { href: "/pricing", label: "Pricing" },
];

const getStartedClasses =
  "h-11 rounded-lg bg-[#5b5bd6] bg-linear-to-r from-[#5b5bd6] to-[#6a5ef7] px-6 text-sm font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:from-[#6a63e8] hover:to-[#7a6cff]";

export function Navbar() {

  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  const userName = session?.user.name || "User";
  const userEmail = session?.user.email || "";

  const isLoggedIn = !!session?.user;

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to log out.");
        return;
      }

      await refetch();

      toast.success("Logged out successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
    }
  };


  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!accountMenuOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        accountMenuRef.current &&
        event.target instanceof Node &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountMenuOpen]);

  return (
    <header className="bg-[#0a0a0a] px-6 py-3">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between rounded-2xl border border-white/[0.06] bg-[#171717] px-6 md:h-[88px] md:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="hireloop home"
        >
          <Image
            src="/assets/logo.png"
            alt="hireloop"
            width={154}
            height={44}
            loading="eager"
            className="h-9 w-auto"
          />
        </Link>

        <div className="flex items-center gap-6">

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#d4d4d4] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-9 bg-white/10 lg:block"
          />

          {/* Desktop Authentication */}
          {isPending ? (
            <div className="hidden h-10 w-28 animate-pulse rounded-lg bg-white/5 sm:block" />
          ) :
            isLoggedIn ? (
              <div ref={accountMenuRef} className="relative hidden sm:block">

                {/* Dropdown Trigger */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                  className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-white hover:bg-white/[0.08] hover:text-white"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#5b5bd6]/20 text-xs font-semibold text-[#a49bff]">
                    {userName.charAt(0).toUpperCase()}
                  </div>

                  <span className="max-w-32 truncate text-sm font-medium">
                    {userName}
                  </span>

                  <ChevronDown
                    className={`size-4 text-white/50 transition-transform ${accountMenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </Button>

                {/* Dropdown Content */}
                {accountMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#171717] p-2 shadow-xl shadow-black/40"
                  >
                    {/* User Information */}
                    <div className="px-3 py-3">
                      <p className="text-sm font-semibold text-white">
                        {userName}
                      </p>

                      <p className="mt-1 truncate text-xs text-white/50">
                        {userEmail}
                      </p>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Dashboard */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        router.push("/dashboard");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </button>

                    <Separator className="my-1 bg-white/10" />

                    {/* Logout */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Keep your existing Sign In and Get Started buttons here
              <>
                {/* Sign In */}
                <Link
                  href="/signin"
                  className="hidden text-sm font-medium text-[#7c6cf5] transition-colors hover:text-[#9a8cff] sm:inline-flex"
                >
                  Sign In
                </Link>

                {/* Get Started */}
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    getStartedClasses
                  )}
                >
                  Get Started
                </Link>
              </>
            )
          }

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Open menu"
                  className="text-white hover:bg-white/10 hover:text-white lg:hidden"
                />
              }
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="border-white/10 bg-[#171717] text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-white">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">

                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}

                <Separator className="my-3 bg-white/10" />

                {/* Mobile Authentication */}
                {isPending ? (
                  <div className="h-10 animate-pulse rounded-lg bg-white/5" />
                ) : isLoggedIn ? (
                  <>
                    {/* User Information */}
                    <div className="mb-2 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#5b5bd6]/20 text-sm font-semibold text-[#a49bff]">
                        {userName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {userName}
                        </p>

                        <p className="truncate text-xs text-white/50">
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    {/* Dashboard */}
                    <SheetClose
                      render={
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                        />
                      }
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </SheetClose>

                    {/* Logout */}
                    <SheetClose
                      render={
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                        />
                      }
                    >
                      <LogOut className="size-4" />
                      Log out
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose
                      render={
                        <Link
                          href="/signin"
                          className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#7c6cf5] transition-colors hover:bg-white/5 hover:text-[#9a8cff]"
                        />
                      }
                    >
                      Sign In
                    </SheetClose>

                    <SheetClose
                      render={
                        <Link
                          href="/signup"
                          className={cn(
                            buttonVariants({ size: "lg" }),
                            "mt-2 h-11 w-full rounded-lg",
                            getStartedClasses
                          )}
                        />
                      }
                    >
                      Get Started
                    </SheetClose>
                  </>
                )}

              </nav>
            </SheetContent>
          </Sheet>

        </div>
      </nav>
    </header>
  );
}
