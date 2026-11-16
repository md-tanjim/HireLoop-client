
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Users,
  BriefcaseBusiness,
  ShieldCheck,
  UserCheck,
  Ban,
  Check,
  ChevronDown,
} from "lucide-react";

import type {
  AdminUser,
  UserRole,
} from "@/types/userType";
import { updateUserRole } from "@/lib/actions/updateUserRole";
import { refresh } from "next/cache";


type UserManagementProps = {
  users: AdminUser[];
};

type RoleFilter = "all" | UserRole;

const roleStyles: Record<UserRole, string> = {
  admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  recruiter:
    "bg-violet-500/10 text-violet-400 border-violet-500/20",
  seeker: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

// Converts the date returned by Better Auth into a string.
const getDate = (date: AdminUser["createdAt"]): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }

  return typeof date === "string" ? date : date.$date;
};

// Formats dates for the table.
const formatDate = (date: AdminUser["createdAt"]) => {
  const parsedDate = new Date(getDate(date));

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsedDate);
};

const UserManagement = ({ users }: UserManagementProps) => {
  // Search and filter states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  // Stores the selected accountType temporarily for each user.
  const [roleDrafts, setRoleDrafts] = useState<
    Record<string, UserRole>
  >({});

  // Stores temporary feedback after triggering an action.
  const [actionFeedback, setActionFeedback] = useState<
    Record<string, string>
  >({});

  // New signups state
  const [newSignups, setNewSignups] = useState(0);

  // --------------------------------------------------
  // 1. FILTER USERS
  // --------------------------------------------------

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "all" || user.accountType === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // --------------------------------------------------
  // 2. DASHBOARD STATISTICS
  // --------------------------------------------------

  const activeUsers = users.filter(
    (user) => user.status === "active"
  ).length;

  const recruiterCount = users.filter(
    (user) => user.accountType === "recruiter"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "suspended"
  ).length;

  // Date.now() must not be called directly during render.
  useEffect(() => {
    const now = Date.now();
    const last24Hours = now - 24 * 60 * 60 * 1000;

    const count = users.filter((user) => {
      const createdAt = new Date(
        getDate(user.createdAt)
      ).getTime();

      return (
        createdAt >= last24Hours &&
        createdAt <= now
      );
    }).length;
// eslint-disable-next-line
    setNewSignups(count);
  }, [users]);

  // --------------------------------------------------
  // 3. SUSPEND / ACTIVATE USER
  // --------------------------------------------------

  const handleStatusToggle = (user: AdminUser) => {
    const nextStatus =
      user.status === "active" ? "suspended" : "active";

    console.log("Status change requested:", {
      userId: user.id,
      name: user.name,
      currentStatus: user.status,
      newStatus: nextStatus,
    });

    // TODO:
    // Call your suspend/activate API here.
    // After a successful response, refresh the user data.

    setActionFeedback((previous) => ({
      ...previous,
      [user.id]: `Status action triggered: ${nextStatus}. API not connected yet.`,
    }));




  };

  // --------------------------------------------------
  // 4. HANDLE ROLE SELECTION
  // --------------------------------------------------

  const handleRoleSelect = (
    userId: string,
    selectedRole: UserRole
  ) => {
    setRoleDrafts((previous) => ({
      ...previous,
      [userId]: selectedRole,
    }));

    // Clear previous feedback when selecting another accountType.
    setActionFeedback((previous) => ({
      ...previous,
      [userId]: "",
    }));





  };

  // --------------------------------------------------
  // 5. CONFIRM ROLE CHANGE
  // --------------------------------------------------

  const handleRoleChange = async(user: AdminUser) => {
    const selectedRole =
      roleDrafts[user.id] ?? user.accountType;

    // No need to continue if the accountType hasn't changed.
    if (selectedRole === user.accountType) {
      return;
    }

    console.log("Role change requested:", {
      userId: user.id,
      name: user.name,
      email: user.email,
      currentRole: user.accountType,
      newRole: selectedRole,
    });



    const res = await updateUserRole(user.id, selectedRole);
    
    console.log(res, "after submit")


    // TODO:
    // Call your accountType-update API here.
    // After a successful response, refresh the user data.

    // setActionFeedback((previous) => ({
    //   ...previous,
    //   [user.id]: `Role change requested: ${user.accountType} → ${selectedRole}. API not connected yet.`,
    // }));
  };

  // --------------------------------------------------
  // 6. EXPORT USERS TO CSV
  // --------------------------------------------------

  const handleExport = () => {
    const csvHeaders = [
      "Name",
      "Email",
      "Role",
      "Status",
      "Join Date",
    ];

    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.accountType,
      user.status,
      formatDate(user.createdAt),
    ]);

    const escapeCSV = (value: string) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [
      csvHeaders.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hireloop-users.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------
  // 7. STATISTICS CARD DATA
  // --------------------------------------------------

  const stats = [
    {
      label: "Total Active Users",
      value: activeUsers,
      description: "Currently active accounts",
      icon: Users,
      color: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Recruiters",
      value: recruiterCount,
      description: "Accounts with recruiter access",
      icon: BriefcaseBusiness,
      color: "text-violet-400",
      iconBg: "bg-violet-500/10",
    },
    {
      label: "Suspended Accounts",
      value: suspendedUsers,
      description: "Accounts currently suspended",
      icon: Ban,
      color: "text-red-400",
      iconBg: "bg-red-500/10",
    },
    {
      label: "New Signups (24h)",
      value: newSignups,
      description: "Registered in the last 24 hours",
      icon: UserCheck,
      color: "text-amber-400",
      iconBg: "bg-amber-500/10",
    },
  ];

  // --------------------------------------------------
  // 8. PAGE UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#0D0D0F] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">

        {/* ================= PAGE HEADER ================= */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              User Management
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Review, filter, and manage platform access for all users.
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Role filter */}

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as RoleFilter)
                }
                className="h-10 appearance-none rounded-lg border border-white/10 bg-[#131316] pl-4 pr-10 text-sm text-gray-300 outline-none transition focus:border-violet-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="seeker">Seeker</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* Export button */}

            <button
              type="button"
              onClick={handleExport}
              disabled={filteredUsers.length === 0}
              className="flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Export List
            </button>
          </div>
        </div>

        {/* ================= STATISTICS ================= */}

        <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-[#27272A] bg-[#141416] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    {stat.label}
                  </p>

                  <div
                    className={`rounded-lg p-2 ${stat.iconBg}`}
                  >
                    <Icon
                      size={18}
                      className={stat.color}
                    />
                  </div>
                </div>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {stat.value.toLocaleString()}
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* ================= USER TABLE ================= */}

        <section className="overflow-hidden rounded-xl border border-[#27272A] bg-[#141416]">

          {/* Search section */}

          <div className="flex flex-col gap-3 border-b border-[#27272A] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-medium">All Users</h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredUsers.length} of {users.length} users
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name or email..."
                className="h-10 w-full rounded-lg border border-[#303034] bg-[#0D0D0F] pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
              />
            </div>
          </div>

          {/* Table */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">

              {/* Table header */}

              <thead className="bg-[#1A1A1E]">
                <tr className="text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4 font-medium">
                    User Name
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Email Address
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Role
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Join Date
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table body */}

              <tbody className="divide-y divide-[#27272A]">

                {filteredUsers.map((user) => {
                  const isActive = user.status === "active";

                  const selectedRole =
                    roleDrafts[user.id] ?? user.accountType;

                  const hasRoleChanged =
                    selectedRole !== user.accountType;

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-white/[0.02]"
                    >

                      {/* User name */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#25252A] text-xs font-semibold text-gray-300">
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </div>

                          <span className="text-sm font-medium text-gray-200">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Email address */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-400">
                          {user.email}
                        </span>
                      </td>

                      {/* Current accountType */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${roleStyles[user.accountType]}`}
                        >
                          {user.accountType === "admin" && (
                            <ShieldCheck size={12} />
                          )}

                          {user.accountType === "recruiter" && (
                            <BriefcaseBusiness size={12} />
                          )}

                          {user.accountType === "seeker" && (
                            <UserCheck size={12} />
                          )}

                          {user.accountType}
                        </span>
                      </td>

                      {/* Join date */}

                      <td className="px-5 py-4 text-sm text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Account status */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                            isActive
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-red-500/20 bg-red-500/10 text-red-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive
                                ? "bg-emerald-400"
                                : "bg-red-400"
                            }`}
                          />

                          {isActive ? "Active" : "Suspended"}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">
                        <div className="flex min-w-[260px] flex-col items-end gap-2">

                          {/* Role selector + Confirm */}

                          <div className="flex items-center gap-2">

                            <select
                              value={selectedRole}
                              onChange={(e) =>
                                handleRoleSelect(
                                  user.id,
                                  e.target.value as UserRole
                                )
                              }
                              aria-label={`Change accountType for ${user.name}`}
                              className="h-8 rounded-md border border-[#303034] bg-[#0D0D0F] px-2 text-xs text-gray-300 outline-none transition focus:border-violet-500"
                            >
                              <option value="seeker">
                                Seeker
                              </option>

                              <option value="recruiter">
                                Recruiter
                              </option>

                              <option value="admin">
                                Admin
                              </option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleRoleChange(user)}
                              disabled={!hasRoleChanged}
                              className="flex h-8 items-center gap-1.5 rounded-md bg-violet-600 px-3 text-xs font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Check size={13} />
                              Confirm
                            </button>
                          </div>

                          {/* Suspend / Activate */}

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusToggle(user)
                            }
                            className={`text-xs font-medium transition hover:underline ${
                              isActive
                                ? "text-red-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {isActive ? "Suspend" : "Activate"}
                          </button>

                          {/* Action feedback */}

                          {actionFeedback[user.id] && (
                            <p
                              role="status"
                              className="max-w-[260px] text-right text-[10px] leading-4 text-gray-500"
                            >
                              {actionFeedback[user.id]}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Empty state */}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-16 text-center"
                    >
                      <Users
                        size={28}
                        className="mx-auto text-gray-600"
                      />

                      <p className="mt-3 text-sm font-medium text-gray-300">
                        No users found
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Try changing your search or role filter.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
};

export default UserManagement;
