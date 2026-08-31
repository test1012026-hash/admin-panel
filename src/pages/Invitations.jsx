import { useEffect, useState } from "react";
import { api, errMessage } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export default function Invitations() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const isReseller = user?.role === "reseller";

  const [invitations, setInvitations] = useState([]);
  const [trialDays, setTrialDays] = useState(90);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("subscriber");
  const [groupName, setGroupName] = useState("");
  const [lastInvite, setLastInvite] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const { data } = await api.get("/api/admin/invitations");
    setInvitations(data.invitations || []);
    if (data.trialDays) setTrialDays(data.trialDays);
  }

  useEffect(() => {
    load().catch((err) => setError(errMessage(err)));
  }, []);

  async function createInvite(e) {
    e.preventDefault();
    setError("");
    if (role === "reseller" && !isSuperAdmin) {
      setError("Only super admin can invite resellers");
      return;
    }
    try {
      const payload = { email, role };
      if (role === "group_admin") {
        payload.groupName = groupName;
      }
      const { data } = await api.post("/api/admin/invitations", payload);
      setLastInvite(data);
      setEmail("");
      setGroupName("");
      await load();
    } catch (err) {
      setError(errMessage(err));
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">Invitations</h1>
        {trialDays ? (
          <p className="mt-1 text-sm text-ink-500">
            New accounts get a {trialDays}-day subscription period. Invitation links are valid for 24 hours.
          </p>
        ) : (
          <p className="mt-1 text-sm text-ink-500">
            Invitation links are valid for 24 hours.
          </p>
        )}
        {isSuperAdmin ? (
          <p className="mt-1 text-sm text-ink-500">
            Only super admin can invite resellers.
          </p>
        ) : null}
      </header>

      <form
        className="card mb-6 grid gap-3 p-5 sm:grid-cols-3"
        onSubmit={createInvite}
      >
        <div className="sm:col-span-2">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Role</label>
          <select
            className="input"
            value={role}
            onChange={(e) => {
              const next = e.target.value;
              setRole(next);
              if (next !== "group_admin") setGroupName("");
            }}
          >
            <option value="subscriber">Subscriber</option>
            {(isSuperAdmin) && (
              <option value="group_admin">Group admin</option>
            )}
            {isSuperAdmin && <option value="reseller">Reseller</option>}
          </select>
        </div>
        {role === "group_admin" ? (
          <div className="sm:col-span-3">
            <label className="label">Group name</label>
            <input
              className="input"
              required
              minLength={2}
              maxLength={120}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Required — created when they accept"
            />
          </div>
        ) : null}
        <div className="sm:col-span-3">
          <button type="submit" className="btn-primary">
            Send invite
          </button>
        </div>
      </form>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {lastInvite?.inviteUrl && (
        <div className="card mb-6 border-accent/30 bg-accent-soft/40 p-4 text-sm">
          <p className="font-semibold text-accent-dark">Invite link generated (valid for 24 hours)</p>
          <p className="mt-1 text-xs text-ink-600">
            An email invitation was dispatched. You can also copy the link directly:
          </p>
          <p className="mt-2 break-all font-mono text-xs bg-white/80 p-2 rounded border border-accent/20 select-all">
            {lastInvite.inviteUrl}
          </p>
        </div>
      )}

      <div className="table-wrap">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-200 bg-ink-50 text-xs uppercase text-ink-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Group</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Invite expires</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((i) => (
              <tr key={i.id} className="border-b border-ink-100">
                <td className="px-4 py-3">{i.email}</td>
                <td className="px-4 py-3 capitalize">
                  {String(i.role).replace("_", " ")}
                </td>
                <td className="px-4 py-3">{i.groupName || "—"}</td>
                <td className="px-4 py-3">{i.status}</td>
                <td className="px-4 py-3">
                  {i.expiresAt ? new Date(i.expiresAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
