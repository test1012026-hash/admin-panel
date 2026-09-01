import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { api, errMessage } from "../lib/api";

export default function Onboarding() {
  const { user, bootstrapping, refreshMe, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [path, setPath] = useState(null); // "group" | "subscriber"
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-500">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.needsOnboarding) {
    return (
      <Navigate
        to={user?.role === "subscriber" ? "/profile" : "/dashboard"}
        replace
      />
    );
  }

  async function chooseSubscriber() {
    setError("");
    setBusy(true);
    try {
      await api.post("/api/admin/auth/onboarding/subscriber", { confirm: true });
      await refreshMe();
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function createGroup(e) {
    e.preventDefault();
    setError("");
    const name = String(groupName || "").trim();
    if (name.length < 2) {
      setError("Enter a group name (at least 2 characters)");
      return;
    }
    setBusy(true);
    try {
      await api.post("/api/admin/auth/onboarding/create-group", { name });
      await refreshMe();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
        style={{ animation: "soft-pulse 5s ease-in-out infinite" }}
      />
      <div className="card page-enter relative w-full max-w-lg overflow-hidden p-8 shadow-lift">
        <p className="font-display text-xl font-bold text-ink-950">
          SecureDocShare
        </p>
        <h1 className="mt-3 text-lg font-semibold text-ink-800">
          How will you use SecureDoc?
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Choose once. You can manage people later from the admin console.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setPath("group");
              setError("");
            }}
            className={[
              "rounded-2xl border px-4 py-5 text-left transition",
              path === "group"
                ? "border-accent bg-accent/5 shadow-sm"
                : "border-ink-200 bg-white hover:border-ink-300",
            ].join(" ")}
          >
            <p className="text-sm font-semibold text-ink-900">Create group</p>
            <p className="mt-1 text-xs text-ink-500">
              You become the group admin and can manage subscribers in your
              group.
            </p>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setPath("subscriber");
              setError("");
            }}
            className={[
              "rounded-2xl border px-4 py-5 text-left transition",
              path === "subscriber"
                ? "border-accent bg-accent/5 shadow-sm"
                : "border-ink-200 bg-white hover:border-ink-300",
            ].join(" ")}
          >
            <p className="text-sm font-semibold text-ink-900">Subscriber</p>
            <p className="mt-1 text-xs text-ink-500">
              Use SecureDoc as an individual to encrypt and decrypt mail.
            </p>
          </button>
        </div>

        {path === "group" ? (
          <form className="mt-6 space-y-4" onSubmit={createGroup}>
            <div>
              <label className="label" htmlFor="group-name">
                Group name
              </label>
              <input
                id="group-name"
                className="input"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Acme Legal Team"
                required
                minLength={2}
                maxLength={120}
                autoFocus
              />
            </div>
            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            ) : null}
            <button className="btn-primary w-full" type="submit" disabled={busy}>
              {busy ? "Creating group…" : "Create group & continue"}
            </button>
          </form>
        ) : null}

        {path === "subscriber" ? (
          <div className="mt-6 space-y-4">
            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              className="btn-primary w-full"
              disabled={busy}
              onClick={chooseSubscriber}
            >
              {busy ? "Saving…" : "Continue as subscriber"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
