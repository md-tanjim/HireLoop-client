
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Bookmark,
  FileText,
  WalletCards,
  Settings,
  Users,
  Building2,
  PlusCircle,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { useSession } from "@/lib/auth-client";

type UserRole = "seeker" | "recruiter" | "admin";

type MenuItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  seeker: [
    {
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      url: "/dashboard/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Saved Jobs",
      url: "/dashboard/saved-jobs",
      icon: Bookmark,
    },
    {
      name: "Applications",
      url: "/dashboard/applications",
      icon: FileText,
    },
    {
      name: "Billing",
      url: "/dashboard/billing",
      icon: WalletCards,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],

  recruiter: [
    {
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      name: "Add Jobs",
      url: "/dashboard/add-jobs",
      icon: PlusCircle,
    },
    {
      name: "Manage Jobs",
      url: "/dashboard/manage-jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Applications",
      url: "/dashboard/applications",
      icon: FileText,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],

  admin: [
    {
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      name: "Companies",
      url: "/dashboard/companies",
      icon: Building2,
    },
    {
      name: "Jobs",
      url: "/dashboard/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Payments",
      url: "/dashboard/payments",
      icon: WalletCards,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function DashboardSidebar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  const userName = session?.user.name || "User";
  const userImage = session?.user.image || null;
  const userRole = session?.user.role;

  const validRole: UserRole =
    userRole === "recruiter" ||
    userRole === "admin" ||
    userRole === "seeker"
      ? userRole
      : "seeker";


  const roleInfo = {
  seeker: {
    title: "Seeker",
    badge: "Professional Tier",
  },
  recruiter: {
    title: "Recruiter",
    badge: "Premium account",
  },
  admin: {
    title: "Administrator",
    badge: "Admin Console",
  },
}[validRole];


  const menuItems = menuItemsByRole[validRole];

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  if (isPending) {
    return (
      <Sidebar className="border-r border-white/10 bg-[#080809]">
        <SidebarHeader className="p-6">
          <div className="h-9 w-32 animate-pulse rounded bg-white/10" />
        </SidebarHeader>
        <SidebarContent className="px-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-10 animate-pulse rounded-lg bg-white/5"
              />
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r border-white/10 bg-[#080809] text-white">

      {/* Header */}
      <SidebarHeader className="gap-6 px-4 pb-4 pt-8 sm:px-6">

        {/* Logo */}
        <Link href="/" className="mb-1 flex items-center px-3">
          <Image
            src="/assets/logo.png"
            alt="HireLoop"
            width={150}
            height={45}
            priority
            className="h-auto w-[140px] object-contain"
          />
        </Link>

        {/* Admin Header */}
        {/* {validRole === "admin" && (
          <div className="px-3">
            <p className="text-sm font-medium text-[#858590]">
              Admin Console
            </p>
          </div>
        )} */}

        {/* Seeker Profile */}
        {/* {validRole === "seeker" && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#151518] p-3">

            <div className="size-10 shrink-0 overflow-hidden rounded-full bg-[#292938]">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  className="size-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm font-semibold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[#e7e7ec]">
                Seeker Portal
              </p>

              <p className="mt-0.5 text-sm text-[#9999a4]">
                Professional Tier
              </p>
            </div>

          </div>
        )} */}



        {/* Recruiter Profile */}
        {/* {validRole === "recruiter" && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#151518] p-3">

            <div className="size-10 shrink-0 overflow-hidden rounded-full bg-[#292938]">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  className="size-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm font-semibold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[#e7e7ec]">
                {userName}
              </p>

              <p className="mt-0.5 text-sm text-[#9999a4]">
                Recruiter
              </p>

              <span className="mt-1 inline-flex rounded-full border border-[#5b5bd6]/50 bg-[#5b5bd6]/15 px-2.5 py-0.5 text-xs font-medium text-[#a49bff]">
                Premium account
              </span>
            </div>

          </div>
        )} */}


            
{/* Common User Profile */}
<div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#151518] p-3">

  {/* Profile Image */}
  <div className="size-10 shrink-0 overflow-hidden rounded-full bg-[#292938]">
    {userImage ? (
      <Image
        src={userImage}
        alt={userName}
        className="size-full object-cover"
        width={40}
        height={40}
      />
    ) : (
      <div className="flex size-full items-center justify-center text-sm font-semibold text-white">
        {userName.charAt(0).toUpperCase()}
      </div>
    )}
  </div>

  {/* User Details */}
  <div className="min-w-0 flex-1">

    <p className="truncate text-base font-semibold text-[#e7e7ec]">
      {userName}
    </p>

    <p className="mt-0.5 text-sm text-[#9999a4]">
      {roleInfo.title}
    </p>

    <span className="mt-1 inline-flex rounded-full border border-[#5b5bd6]/50 bg-[#5b5bd6]/15 px-2.5 py-0.5 text-xs font-medium text-[#a49bff]">
      {roleInfo.badge}
    </span>

  </div>

</div>




      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup className="px-4 py-2">

          <SidebarMenu className="gap-1.5">

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);

              return (
                <SidebarMenuItem key={item.name}>

                  <SidebarMenuButton
                    isActive={active}
                    tooltip={item.name}
                    render={<Link href={item.url} />}
                    className={`
                      relative h-10 rounded-lg px-3 text-[15px]
                      transition-colors
                      ${
                        active
                          ? "bg-[#252529] text-[#f2f2f5] hover:bg-[#252529] hover:text-white"
                          : "text-[#a0a0aa] hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    {active && (
                      <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full bg-[#6861ff]" />
                    )}

                    <Icon
                      className={`size-[22px] ${
                        active ? "text-[#a5a0ff]" : "text-[#777782]"
                      }`}
                    />

                    <span>{item.name}</span>

                  </SidebarMenuButton>

                </SidebarMenuItem>
              );
            })}

          </SidebarMenu>

        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter />

    </Sidebar>
  );
}
