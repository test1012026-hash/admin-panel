import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth.jsx";
import { api, errMessage } from "../lib/api";
import ScopedPeopleList from "../components/ScopedPeopleList.jsx";

export default function Groups() {
  const { user } = useAuth();
  const isSubscriber = user?.role === "subscriber";
  const isGroupAdmin = user?.role === "group_admin";
  const canCreate =
    user?.role === "reseller" || user?.role === "super_admin";

  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [description, setDescription] = useState("");
  const [lastInviteUrl, setLastInviteUrl] = useState("");

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/groups");
      setGroups(data.groups || []);
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(errMessage(err)));
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLastInviteUrl("");
    setBusy(true);
    try {
      const { data } = await api.post("/api/admin/groups", {
        name,
        description,
        adminEmail,
      });
      if (data.mode === "invited") {
        setInfo(
          data.message ||
            "Invite created. Share the link so the group admin can accept.",
        );
        setLastInviteUrl(data.inviteUrl || "");
      } else {
        setInfo(`Group “${data.group?.name || name}” created.`);
      }
      setName("");
      setAdminEmail("");
      setDescription("");
      await load();
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(groupUuid) {
    if (
      !window.confirm(
        "Delete this group?\n\nUser accounts will NOT be deleted. Group links will be cleared and the group admin will become a subscriber.",
      )
    ) {
      return;
    }
    setError("");
    try {
      await api.delete(`/api/admin/groups/${groupUuid}`);
      await load();
    } catch (err) {
      setError(errMessage(err));
    }
  }

  async function onRename(group) {
    const next = window.prompt("New group name", group.name);
    if (!next || !String(next).trim()) return;
    setError("");
    try {
      await api.patch(`/api/admin/groups/${group.uuid}`, {
        name: String(next).trim(),
      });
      await load();
    } catch (err) {
      setError(errMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <h1 className="text-lg font-semibold text-ink-900">Groups</h1>
        <p className="mt-1 text-sm text-ink-500">
          {canCreate
            ? "Create a named group and assign a group admin. If they do not have an account yet, an invite is sent."
            : "Named groups in your scope. The group admin manages subscribers."}
        </p>

        {canCreate ? (
          <form
            className="mt-5 grid gap-3 sm:grid-cols-2"
            onSubmit={onCreate}
          >
            <div>
              <label className="label" htmlFor="group-name">
                Group name
              </label>
              <input
                id="group-name"
                className="input"
                required
                minLength={2}
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Legal"
              />
            </div>
            <div>
              <label className="label" htmlFor="group-admin-email">
                Group admin email
              </label>
              <input
                id="group-admin-email"
                className="input"
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@company.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="group-description">
                Description (optional)
              </label>
              <input
                id="group-description"
                className="input"
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <button className="btn-primary" type="submit" disabled={busy}>
                {busy ? "Creating…" : "Create group"}
              </button>
            </div>
          </form>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="mt-3 rounded-xl bg-accent-soft/50 px-3 py-2 text-sm text-accent-dark">
            {info}
          </p>
        ) : null}
        {lastInviteUrl ? (
          <p className="mt-2 break-all text-xs text-ink-600">{lastInviteUrl}</p>
        ) : null}

        {loading ? (
          <p className="mt-4 text-sm text-ink-500">Loading groups…</p>
        ) : groups.length === 0 ? (
          <p className="mt-4 text-sm text-ink-500">
            {isGroupAdmin
              ? "You have not created a named group yet."
              : "No groups in your scope yet."}
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-2 py-2 font-semibold">Group</th>
                  <th className="px-2 py-2 font-semibold">Admin</th>
                  <th className="px-2 py-2 font-semibold">Created</th>
                  {canCreate ? (
                    <th className="px-2 py-2 font-semibold">Actions</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <tr key={g.uuid} className="border-b border-ink-50">
                    <td className="px-2 py-3">
                      <p className="font-medium text-ink-900">{g.name}</p>
                      {g.description ? (
                        <p className="text-xs text-ink-500">{g.description}</p>
                      ) : null}
                    </td>
                    <td className="px-2 py-3 text-ink-700">
                      {g.adminName || g.adminEmail || g.adminUuid}
                    </td>
                    <td className="px-2 py-3 text-ink-500">
                      {g.createdAt
                        ? new Date(g.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    {canCreate ? (
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="text-sm font-semibold text-accent hover:underline"
                            onClick={() => onRename(g)}
                          >
                            Rename
                          </button>
                          <button
                            type="button"
                            className="text-sm font-semibold text-danger hover:underline"
                            onClick={() => onDelete(g.uuid)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ScopedPeopleList
        title="Group admins"
        description={
          isSubscriber
            ? "Group directories are managed by your reseller / group admin."
            : user?.role === "super_admin"
              ? "All group admins across the platform."
              : user?.role === "reseller"
                ? "Group admins under your reseller account."
                : "Group admins in your scope."
        }
        roleFilter="group_admin"
        emptyLabel={
          isSubscriber || isGroupAdmin
            ? "No groups to show"
            : "No group admins in your scope"
        }
        emptyHint={
          isSubscriber
            ? "Groups appear here for resellers and super admins."
            : isGroupAdmin
              ? "You are a group admin. Your subscribers appear under Subscribers."
              : "Create a group above, or invite a group admin from Invitations."
        }
      />
    </div>
  );
}
