import { useEffect, useState } from "react";
import { api, errMessage } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export default function Settings() {
  const { user, refreshMe } = useAuth();
  const [form, setForm] = useState({
    tokenExpiryHours: 8,
    checkInIntervalHours: 8,
    keyRotationRemindDays: 90,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/admin/settings")
      .then((res) => setForm({ ...form, ...res.data.settings }))
      .catch((err) => setError(errMessage(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await api.patch("/api/admin/settings", {
        tokenExpiryHours: Number(form.tokenExpiryHours),
        checkInIntervalHours: Number(form.checkInIntervalHours),
        keyRotationRemindDays: Number(form.keyRotationRemindDays),
      });
      setForm({ ...form, ...data.settings });
      setMessage("Settings saved. New token expiry applies on next login.");
      await refreshMe().catch(() => {});
    } catch (err) {
      setError(errMessage(err));
    }
  }

  const canEdit = user?.role === "super_admin";

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">System settings</h1>
      </header>

      <form className="card max-w-xl space-y-4 p-6" onSubmit={save}>
        <div>
          <label className="label">Token expiry (hours)</label>
          <input
            className="input"
            type="number"
            step="0.25"
            min="0.25"
            max="168"
            disabled={!canEdit}
            value={form.tokenExpiryHours}
            onChange={(e) =>
              setForm({ ...form, tokenExpiryHours: e.target.value })
            }
          />
        </div>
        <div>
          <label className="label">Check-in interval (hours)</label>
          <input
            className="input"
            type="number"
            step="0.25"
            min="0.25"
            max="168"
            disabled={!canEdit}
            value={form.checkInIntervalHours}
            onChange={(e) =>
              setForm({ ...form, checkInIntervalHours: e.target.value })
            }
          />
        </div>
        <div>
          <label className="label">Key rotation remind (days)</label>
          <input
            className="input"
            type="number"
            min="1"
            max="730"
            disabled={!canEdit}
            value={form.keyRotationRemindDays}
            onChange={(e) =>
              setForm({ ...form, keyRotationRemindDays: e.target.value })
            }
          />
        </div>

        {message && (
          <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent-dark">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        {canEdit ? (
          <button type="submit" className="btn-primary">
            Save settings
          </button>
        ) : (
          <p className="text-sm text-ink-500">View only — super admin required.</p>
        )}
      </form>
    </div>
  );
}
