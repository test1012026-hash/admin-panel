import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, errMessage } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import { formatRole } from "../lib/format.js";

function useCountUp(target, enabled) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    const end = Number(target) || 0;
    const duration = 700;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(end * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);
  return value;
}

function StatCard({ label, value, hint, to, tone = "teal", delayClass }) {
  const navigate = useNavigate();
  const shown = useCountUp(value, value != null);
  const tones = {
    teal: "from-teal-500/15 via-white to-white hover:border-teal-400/50",
    sky: "from-sky-500/15 via-white to-white hover:border-sky-400/50",
    amber: "from-amber-500/15 via-white to-white hover:border-amber-400/50",
    rose: "from-rose-500/12 via-white to-white hover:border-rose-300/60",
    slate: "from-slate-400/15 via-white to-white hover:border-ink-300",
  };

  return (
    <button
      type="button"
      onClick={() => to && navigate(to)}
      className={[
        "card-interactive page-enter group relative overflow-hidden bg-gradient-to-br p-5 text-left",
        tones[tone] || tones.teal,
        delayClass || "",
      ].join(" ")}
    >
      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition duration-300 group-hover:scale-x-100" />
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums text-ink-950">
        {shown}
      </p>
      {hint && (
        <p className="mt-2 text-xs text-ink-400 transition group-hover:text-accent-dark">
          {hint}
        </p>
      )}
    </button>
  );
}

function RoleBar({ role, count, max }) {
  const pct = max > 0 ? Math.max(8, Math.round((count / max) * 100)) : 0;
  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50/80 px-3 py-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="capitalize font-medium text-ink-700">
          {formatRole(role)}
        </span>
        <span className="font-display font-bold text-ink-950">{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-200/70">
        <div
          className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-teal-400"
          style={{
            width: `${pct}%`,
            animation: "bar-grow 0.7s ease-out both",
          }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get("/api/admin/analytics/summary")
      .then((res) => {
        setSummary(res.data);
        setLoaded(true);
      })
      .catch((err) => setError(errMessage(err)));
  }, []);

  const roleEntries = Object.entries(summary?.byRole || {});
  const maxRole = Math.max(1, ...roleEntries.map(([, c]) => c));
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="page-enter">
      <header className="mb-8 overflow-hidden rounded-3xl border border-ink-200/70 bg-gradient-to-br from-ink-950 via-ink-900 to-accent-dark p-6 text-white shadow-lift sm:p-8">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-100/80">
              {greeting}
              {user?.name
                ? `, ${user.name}`
                : user?.email
                  ? ` · ${user.email}`
                  : ""}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-300">
              90-day subscriptions and account health for your{" "}
              <span className="font-semibold capitalize text-teal-200">
                {formatRole(user?.role) || "admin"}
              </span>{" "}
              scope.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/invitations" className="btn-primary !bg-white !text-ink-950 hover:!bg-teal-50">
              Invite user
            </Link>
            <Link
              to="/subscribers"
              className="btn-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
            >
              View subscribers
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-teal-400/20 blur-2xl" />
      </header>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {!summary && !error && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="card h-28 animate-pulse bg-ink-100/80"
            />
          ))}
        </div>
      )}

      {summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="All accounts"
              value={summary.totals.users}
              hint={`${summary.totals.claimedUsers ?? 0} claimed · ${summary.totals.unclaimedUsers ?? 0} pending`}
              to="/subscribers"
              tone="teal"
              delayClass="stagger-1"
            />
            <StatCard
              label="Subscribers"
              value={summary.totals.subscribers}
              hint={`${summary.totals.subscribersClaimed ?? 0} claimed · ${summary.totals.subscribersUnclaimed ?? 0} unclaimed`}
              to="/subscribers"
              tone="sky"
              delayClass="stagger-2"
            />
            <StatCard
              label="Groups"
              value={summary.totals.groupAdmins}
              hint={`${summary.totals.groupAdminsClaimed ?? 0} claimed · ${summary.totals.groupAdminsUnclaimed ?? 0} unclaimed`}
              to="/groups"
              tone="teal"
              delayClass="stagger-3"
            />
            <StatCard
              label="Resellers"
              value={summary.totals.resellers}
              hint={
                user?.role === "super_admin"
                  ? `${summary.totals.resellersClaimed ?? 0} claimed · ${summary.totals.resellersUnclaimed ?? 0} unclaimed`
                  : "In your scope"
              }
              to={user?.role === "super_admin" ? "/resellers" : "/groups"}
              tone="amber"
              delayClass="stagger-4"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {user?.role === "super_admin" ? (
              <StatCard
                label="Super admin"
                value={summary.totals.superAdmins}
                hint="Platform owners"
                to="/profile"
                tone="slate"
                delayClass="stagger-5"
              />
            ) : null}
            <StatCard
              label="Active subscriptions"
              value={summary.totals.activeSubscriptions}
              hint="Within expiry window"
              to="/subscribers"
              tone="teal"
              delayClass="stagger-5"
            />
            <StatCard
              label="Expired subscriptions"
              value={summary.totals.expiredSubscriptions}
              hint="Needs +90 days"
              to="/subscribers"
              tone="amber"
              delayClass="stagger-6"
            />
            <StatCard
              label="Blocked"
              value={summary.totals.blocked}
              hint="Can still decrypt"
              to="/subscribers"
              tone="rose"
              delayClass="stagger-7"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <StatCard
              label="Pending invites"
              value={summary.totals.pendingInvites}
              hint="Open invitations →"
              to="/invitations"
              tone="sky"
              delayClass="stagger-6"
            />
            <StatCard
              label="Actions (7d)"
              value={summary.totals.actionsLast7Days}
              hint="Audit activity →"
              to="/activity"
              tone="slate"
              delayClass="stagger-7"
            />
            {/* <StatCard
              label="Claimed"
              value={summary.totals.claimedUsers}
              hint="Finished signup"
              to="/subscribers"
              tone="sky"
              delayClass="stagger-7"
            /> */}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card page-enter p-6 stagger-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink-900">
                  By role
                </h2>
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-dark">
                  {roleEntries.length} roles
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {roleEntries.map(([role, count]) => (
                  <RoleBar
                    key={role}
                    role={role}
                    count={count}
                    max={maxRole}
                  />
                ))}
                {!roleEntries.length && (
                  <p className="text-sm text-ink-400">No role data yet</p>
                )}
              </div>
            </div>

            <div className="card page-enter overflow-hidden p-6 stagger-4">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Quick actions
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Jump into common admin workflows.
              </p>
              <div className="mt-4 space-y-2">
                {[
                  {
                    to: "/subscribers",
                    title: "View subscribers",
                    desc: "Accounts in your hierarchy",
                  },
                  {
                    to: "/groups",
                    title: "View groups",
                    desc: "Group admins in your scope",
                  },
                  {
                    to: "/activity",
                    title: "Review audit log",
                    desc: "Role and access changes",
                  },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block rounded-xl border border-ink-100 bg-ink-50/70 px-4 py-3 transition hover:border-accent/40 hover:bg-accent-soft/50"
                  >
                    <p className="text-sm font-semibold text-ink-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-ink-500">{item.desc}</p>
                  </Link>
                ))}
              </div>
              {loaded && summary.mySubscriptionActive != null && (
                <p className="mt-5 rounded-xl border border-teal-200/60 bg-teal-50/80 px-3 py-2 text-xs text-accent-dark">
                  Your subscription:{" "}
                  {summary.mySubscriptionActive ? "active" : "expired"}
                  {summary.mySubscriptionExpiresAt
                    ? ` · ends ${new Date(
                        summary.mySubscriptionExpiresAt,
                      ).toLocaleDateString()}`
                    : ""}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
