import { useEffect, useState } from "react";
import { api, errMessage } from "../lib/api";
import { formatRole } from "../lib/format.js";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_PAGE_SIZE = 20;

const ACTION_LABELS = {
  "admin.user_update": "User updated",
  "admin.make_admin": "Made admin",
  "admin.user_block": "User blocked",
  "admin.user_unblock": "User unblocked",
  "admin.user_soft_delete": "User deleted",
  "admin.subscription_extend": "Subscription extended",
  "admin.invite_create": "Invite created",
  "admin.invite_revoke": "Invite revoked",
  "invite.accepted": "Invite accepted",
  "admin.settings_update": "Settings updated",
};

function actionLabel(action) {
  return ACTION_LABELS[action] || action;
}

export default function Activity() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  async function load({ nextPage = page, nextPageSize = pageSize } = {}) {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/admin/activity", {
        params: { page: nextPage, limit: nextPageSize },
      });
      setLogs(data.logs || []);
      setTotal(Number(data.total) || 0);
      setPage(Number(data.page) || nextPage);
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load({ nextPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">
          Activity logs{" "}
          <span className="text-ink-400">({loading ? "…" : total})</span>
        </h1>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="table-wrap">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-200 bg-ink-50 text-xs uppercase text-ink-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Target</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-ink-100">
                <td className="px-4 py-3 text-md text-ink-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium">
                  {actionLabel(log.action)}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="block font-medium text-ink-800">
                    {log.actorEmail || log.actorUuid || "—"}
                  </span>
                  {log.actorRole ? (
                    <span className="text-ink-400">
                      {formatRole(log.actorRole)}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="block font-medium text-ink-800">
                    {log.targetEmail || log.targetId || "—"}
                  </span>
                  {log.targetType && log.targetType !== "user" ? (
                    <span className="capitalize text-ink-400">
                      {log.targetType}
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
            {!loading && !logs.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-400">
                  No activity yet
                </td>
              </tr>
            )}
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-400">
                  Loading…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {total === 0
            ? "No records"
            : `Showing ${from}–${to} of ${total}`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-ink-500">
            <span className="whitespace-nowrap">Per page</span>
            <select
              className="input w-20 !py-1.5 text-sm"
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
    </div>
  );
}
