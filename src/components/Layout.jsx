import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { formatRole } from "../lib/format.js";

const ALL_LINKS = [
  {
    to: "/",
    label: "Dashboard",
    end: true,
    roles: ["super_admin", "reseller", "group_admin"],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
      />
    ),
  },
  {
    to: "/subscribers",
    label: "Subscribers",
    roles: ["super_admin", "reseller", "group_admin"],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    ),
  },
  {
    to: "/resellers",
    label: "Resellers",
    roles: ["super_admin"],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    to: "/groups",
    label: "Groups",
    roles: ["super_admin", "reseller", "group_admin"],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
  },
  {
    to: "/invitations",
    label: "Invitations",
    roles: ["super_admin", "reseller", "group_admin"],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    to: "/activity",
    label: "Activity",
    roles: ["super_admin", "reseller", "group_admin"],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    to: "/settings",
    label: "Settings",
    roles: ["super_admin"],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
    ),
  },
  {
    to: "/profile",
    label: "Profile",
    roles: ["super_admin", "reseller", "group_admin", "subscriber"],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
  },
];

function Icon({ path }) {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {path}
    </svg>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "subscriber";
  const links = ALL_LINKS.filter((link) => link.roles.includes(role));

  async function signOut() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="relative shrink-0 overflow-hidden border-b border-ink-800/80 bg-ink-950 text-ink-100 lg:flex lg:h-full lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div
          className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
          style={{ animation: "soft-pulse 6s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute -right-10 bottom-24 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl"
          style={{ animation: "soft-pulse 7s ease-in-out infinite 1s" }}
        />

        <div className="relative px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 ring-1 ring-accent/40">
              <span className="font-display text-sm font-bold text-teal-200">
                SD
              </span>
            </div>
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-white">
              SecureDocShare
            </p>
            {/* <p className="text-xs text-ink-400">
              {role === "subscriber" ? "Account" : "Admin console"}
            </p> */}
            </div>
          </div>
        </div>

        <nav className="relative flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition duration-200",
                  isActive
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "text-ink-300 hover:bg-ink-800/80 hover:text-white",
                ].join(" ")
              }
            >
              <Icon path={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative mt-auto hidden border-t border-ink-800/80 px-4 py-4 lg:block">
          <div className="rounded-2xl border border-ink-700/80 bg-ink-900/70 p-3">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || user?.email}
            </p>
            <p className="mt-1 text-xs capitalize text-teal-200/90">
              {formatRole(user?.role)}
              {user?.role === "super_admin" ? " · super" : ""}
            </p>
            <button
              type="button"
              className="btn-secondary mt-3 w-full border-ink-600 bg-ink-950/60 text-ink-100 hover:bg-ink-800"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="relative min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:py-8">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <div>
            <p className="text-sm font-semibold">{user?.email}</p>
            <p className="text-xs capitalize text-accent">
              {formatRole(user?.role)}
            </p>
          </div>
          <button type="button" className="btn-secondary" onClick={signOut}>
            Sign out
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
