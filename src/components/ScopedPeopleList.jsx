import { useEffect, useState } from "react";
import { api, errMessage } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import { formatRole } from "../lib/format";
import UserManageModal from "./UserManageModal.jsx";
import TransferGroupAdminModal from "./TransferGroupAdminModal.jsx";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_PAGE_SIZE = 20;

function TotalChip({ label, value, hint, active }) {
  return (
    <div
      className={[
        "rounded-xl border px-3 py-2 min-w-[5.5rem]",
        active
          ? "border-accent/40 bg-accent-soft/60"
          : "border-ink-200/80 bg-white/80",
      ].join(" ")}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-ink-950">
        {value ?? "—"}
      </p>
      {hint ? (
        <p className="mt-0.5 text-xs leading-tight text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * Shared scoped people list for Subscribers / Groups / Resellers tabs.
 */
export default function ScopedPeopleList({
  title,
  description,
  emptyLabel,
  roleFilter,
  emptyHint,
}) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [listTotal, setListTotal] = useState(0);
  const [totals, setTotals] = useState(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [transferAdminUser, setTransferAdminUser] = useState(null);

  const canManage =
    user?.role === "super_admin" ||
    user?.role === "reseller" ||
    user?.role === "group_admin";

  const showResellers = user?.role === "super_admin";
  const totalPages = listTotal > 0 ? Math.ceil(listTotal / pageSize) : 0;
  const from = listTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, listTotal);

  async function load({
    nextPage = page,
    nextPageSize = pageSize,
    nextQ = q,
  } = {}) {
    setLoading(true);
    setError("");
    try {
      // Same role as analytics: all accounts (claimed + unclaimed). Exclude self only on same-role lists.
      const [listRes, summaryRes] = await Promise.all([
        api.get("/api/admin/users", {
          params: {
            role: roleFilter,
            q: nextQ,
            includeBlocked: true,
            excludeSelf: user?.role === roleFilter,
            page: nextPage,
            limit: nextPageSize,
          },
        }),
        api.get("/api/admin/analytics/summary"),
      ]);
      const total = Number(listRes.data.total) || 0;
      const returnedPage = Number(listRes.data.page) || nextPage;
      setRows(listRes.data.users || []);
      setListTotal(total);
      setPage(returnedPage);
      setTotals(summaryRes.data.totals || null);
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
    load({ nextPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, user?.role]);

  function runSearch() {
    setPage(1);
    load({ nextPage: 1, nextQ: q });
  }

  function changePageSize(next) {
    const size = Number(next) || DEFAULT_PAGE_SIZE;
    setPageSize(size);
    setPage(1);
    load({ nextPage: 1, nextPageSize: size });
  }

  function goToPage(next) {
    if (next < 1 || (totalPages > 0 && next > totalPages)) return;
    setPage(next);
    load({ nextPage: next });
  }

  async function act(uuid, path, body) {
    setBusy(uuid + path);
    setError("");
    try {
      await api.post(`/api/admin/users/${uuid}/${path}`, body || {});
      await load();
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy("");
    }
  }

  async function removeFromGroup(u) {
    const email = u.email || "this user";
    if (
      !confirm(
        `Remove ${email} from their group?\n\nThey will become an independent user and will no longer be linked to any group.`,
      )
    ) {
      return;
    }
    setBusy(u.uuid + "remove-group");
    setError("");
    try {
      await api.post(`/api/admin/users/${u.uuid}/remove-from-group`);
      if (viewUser?.uuid === u.uuid) {
        setViewUser(null);
      }
      await load();
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy("");
    }
  }

  async function handleDeleteUser(u) {
    if (u.role === "group_admin" && (user?.role === "super_admin" || user?.role === "reseller")) {
      setTransferAdminUser(u);
      return;
    }
    softDelete(u.uuid);
  }

  async function softDelete(uuid) {
    if (
      !confirm(
        "Soft-delete this account? They stay in the database but cannot login until restored.",
      )
    ) {
      return;
    }
    setBusy(uuid + "delete");
    setError("");
    try {
      await api.delete(`/api/admin/users/${uuid}`);
      setViewUser(null);
      await load();
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy("");
    }
  }

  async function openView(u) {
    setError("");
    // Open immediately with row data so fields are prefilled, then refresh from API.
    setViewUser(u);
    try {
      const { data } = await api.get(`/api/admin/users/${u.uuid}`);
      if (data.user) setViewUser(data.user);
    } catch (err) {
      setError(errMessage(err));
    }
  }

  const colSpan = canManage ? 7 : 6;

  return (
    <div>
      <header className="mb-6 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">
              {title}{" "}
              <span className="text-ink-400">
                ({loading ? "…" : listTotal})
              </span>
            </h1>
            {/* <p className="mt-1 text-sm text-ink-500">{description}</p> */}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="input w-56"
              placeholder="Search name or email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
            />
            <button type="button" className="btn-secondary" onClick={runSearch}>
              Search
            </button>
          </div>
        </div>

        {/* <div className="flex flex-wrap gap-2">
          <TotalChip label="All accounts" value={totals?.users} />
          <TotalChip
            label="Claimed"
            value={totals?.claimedUsers}
            hint={`${totals?.unclaimedUsers ?? 0} unclaimed`}
          />
          <TotalChip
            label="Subscribers"
            value={totals?.subscribers}
            hint={
              totals
                ? `${totals.subscribersClaimed ?? 0} claimed · ${totals.subscribersUnclaimed ?? 0} unclaimed`
                : undefined
            }
            active={roleFilter === "subscriber"}
          />
          <TotalChip
            label="Groups"
            value={totals?.groupAdmins}
            hint={
              totals
                ? `${totals.groupAdminsClaimed ?? 0} claimed · ${totals.groupAdminsUnclaimed ?? 0} unclaimed`
                : undefined
            }
            active={roleFilter === "group_admin"}
          />
          {showResellers ? (
            <TotalChip
              label="Resellers"
              value={totals?.resellers}
              hint={
                totals
                  ? `${totals.resellersClaimed ?? 0} claimed · ${totals.resellersUnclaimed ?? 0} unclaimed`
                  : undefined
              }
              active={roleFilter === "reseller"}
            />
          ) : null}
          {showResellers ? (
            <TotalChip label="Super admin" value={totals?.superAdmins} />
          ) : null}
          <TotalChip
            label="Active sub"
            value={totals?.activeSubscriptions}
            hint="Any role with active plan"
          />
          <TotalChip label="Expired" value={totals?.expiredSubscriptions} />
          <TotalChip label="Blocked" value={totals?.blocked} />
        </div> */}
      </header>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="table-wrap">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-200 bg-ink-50 text-xs uppercase text-ink-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Subscription</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Claim</th>
              {canManage ? <th className="px-4 py-3">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.uuid} className="border-b border-ink-100 align-top">
                <td className="px-4 py-3">
                  <p className="text-ink-500">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      u.subscriptionActive
                        ? "text-accent"
                        : "font-medium text-danger"
                    }
                  >
                    {u.subscriptionActive ? "Active" : "Expired"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {u.subscriptionExpiresAt
                    ? new Date(u.subscriptionExpiresAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {u.blocked ? (
                    <span className="font-medium text-warn">Blocked</span>
                  ) : (
                    <span className="text-accent">Active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.claimed ? (
                    <span className="text-ink-600">Claimed</span>
                  ) : (
                    <span className="font-medium text-amber-500">Unclaimed</span>
                  )}
                </td>
                {canManage ? (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        className="btn-secondary !px-2 !py-1 text-xs"
                        disabled={busy.startsWith(u.uuid)}
                        onClick={() => openView(u)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn-secondary !px-2 !py-1 text-xs"
                        disabled={busy.startsWith(u.uuid)}
                        onClick={() =>
                          act(u.uuid, "extend-subscription", { periods: 1 })
                        }
                      >
                        +90 days
                      </button>
                      {u.blocked ? (
                        <button
                          type="button"
                          className="btn-secondary !px-2 !py-1 text-xs"
                          disabled={busy.startsWith(u.uuid)}
                          onClick={() => act(u.uuid, "unblock")}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-secondary !px-2 !py-1 text-xs"
                          disabled={busy.startsWith(u.uuid)}
                          onClick={() => act(u.uuid, "block")}
                        >
                          Block
                        </button>
                      )}
                      {u.role === "group_admin" && (user?.role === "super_admin" || user?.role === "reseller") ? (
                        <button
                          type="button"
                          className="btn-secondary !px-2 !py-1 text-xs font-semibold text-teal-700"
                          title="Transfer group admin role to another member"
                          disabled={busy.startsWith(u.uuid)}
                          onClick={() => setTransferAdminUser(u)}
                        >
                          Change Admin
                        </button>
                      ) : null}
                      {(u.groupAdminUuid || u.groupUuid || u.parentUuid) ? (
                        <button
                          type="button"
                          className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                          title="Remove from group"
                          disabled={busy.startsWith(u.uuid)}
                          onClick={() => removeFromGroup(u)}
                        >
                          Remove Group
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn-danger !px-2 !py-1 text-xs"
                        disabled={busy.startsWith(u.uuid)}
                        onClick={() => handleDeleteUser(u)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
            {!loading && !rows.length ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-4 py-10 text-center text-ink-400"
                >
                  <p className="font-medium text-ink-500">{emptyLabel}</p>
                  {emptyHint ? (
                    <p className="mt-1 text-xs text-ink-400">{emptyHint}</p>
                  ) : null}
                </td>
              </tr>
            ) : null}
            {loading ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-4 py-8 text-center text-ink-400"
                >
                  Loading…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {listTotal === 0
            ? "No records"
            : `Showing ${from}–${to} of ${listTotal}`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-ink-500">
            <span className="whitespace-nowrap">Per page</span>
            <select
              className="input !py-1.5 text-sm"
              value={pageSize}
              onChange={(e) => changePageSize(e.target.value)}
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn-secondary !px-3 !py-1.5 text-sm"
            disabled={loading || page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </button>
          <span className="min-w-[5.5rem] text-center text-sm tabular-nums text-ink-600">
            {totalPages === 0 ? "—" : `Page ${page} / ${totalPages}`}
          </span>
          <button
            type="button"
            className="btn-secondary !px-3 !py-1.5 text-sm"
            disabled={loading || totalPages === 0 || page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {viewUser ? (
        <UserManageModal
          user={viewUser}
          actorRole={user?.role}
          onClose={() => setViewUser(null)}
          onSaved={(updated) => {
            setViewUser(updated);
            load();
          }}
        />
      ) : null}

      {transferAdminUser ? (
        <TransferGroupAdminModal
          user={transferAdminUser}
          onClose={() => setTransferAdminUser(null)}
          onTransferred={() => {
            load();
          }}
          onDeletedWithoutTransfer={() => {
            load();
          }}
        />
      ) : null}
    </div>
  );
}
