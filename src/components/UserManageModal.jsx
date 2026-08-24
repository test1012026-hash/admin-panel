import { useEffect, useState } from "react";
import { api, errMessage } from "../lib/api";
import { formatRole } from "../lib/format";

/** Convert API ISO date → value for <input type="datetime-local"> (local time). */
function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function buildFormFromUser(user) {
  if (!user) {
    return {
      name: "",
      phone: "",
      country: "",
      company: "",
      role: "subscriber",
      subscriptionExpiresAt: "",
    };
  }
  return {
    name: user.name ?? "",
    phone: user.phone ?? "",
    country: user.country ?? "",
    company: user.company ?? "",
    role: user.role || "subscriber",
    subscriptionExpiresAt: toDatetimeLocalValue(user.subscriptionExpiresAt),
  };
}

export default function UserManageModal({
  user,
  actorRole,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => buildFormFromUser(user));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const canEditRole = actorRole === "super_admin" || actorRole === "reseller";
  const canEditSubscription =
    actorRole === "super_admin" || actorRole === "reseller";

  useEffect(() => {
    if (!user) return;
    setForm(buildFormFromUser(user));
    setError("");
    setMessage("");
  }, [user]);

  if (!user) return null;

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const body = {
        name: form.name,
        phone: form.phone,
        country: form.country,
        company: form.company,
      };
      if (canEditRole && form.role && form.role !== user.role) {
        body.role = form.role;
      }
      if (canEditSubscription) {
        body.subscriptionExpiresAt = form.subscriptionExpiresAt
          ? new Date(form.subscriptionExpiresAt).toISOString()
          : null;
      }
      const { data } = await api.patch(`/api/admin/users/${user.uuid}`, body);
      setMessage("User updated");
      onSaved?.(data.user);
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 shadow-lift">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold">View / edit user</h2>
            <p className="mt-1 text-sm text-ink-500">{user.email}</p>
          </div>
          <button
            type="button"
            className="btn-secondary !px-2 !py-1"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="space-y-3" onSubmit={save}>
          <div>
            <label className="label">Email</label>
            <input
              className="input bg-ink-50"
              value={user.email || ""}
              disabled
            />
          </div>
          <div>
            <label className="label">Role</label>
            {canEditRole ? (
              <select
                className="input"
                value={form.role || "subscriber"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="subscriber">subscriber</option>
                <option value="group_admin">group admin</option>
                {actorRole === "super_admin" ? (
                  <option value="reseller">reseller</option>
                ) : null}
              </select>
            ) : (
              <input
                className="input bg-ink-50 capitalize"
                value={formatRole(user.role)}
                disabled
              />
            )}
          </div>
          {["name", "phone", "country", "company"].map((key) => (
            <div key={key}>
              <label className="label" htmlFor={`edit-${key}`}>
                {key}
              </label>
              <input
                id={`edit-${key}`}
                className="input"
                value={form[key] ?? ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          {canEditSubscription ? (
            <div>
              <label className="label">Subscription expires</label>
              <input
                className="input"
                type="datetime-local"
                value={form.subscriptionExpiresAt || ""}
                onChange={(e) =>
                  setForm({ ...form, subscriptionExpiresAt: e.target.value })
                }
              />
            </div>
          ) : (
            <div>
              <label className="label">Subscription expires</label>
              <input
                className="input bg-ink-50"
                disabled
                value={
                  user.subscriptionExpiresAt
                    ? new Date(user.subscriptionExpiresAt).toLocaleString()
                    : "—"
                }
              />
            </div>
          )}

          {message ? (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent-dark">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
