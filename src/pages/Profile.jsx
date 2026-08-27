import { useEffect, useState } from "react";
import { api, errMessage } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import { formatRole } from "../lib/format";

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className="rounded-xl border border-ink-200/80 bg-ink-50/60 px-3 py-2.5 text-sm text-ink-800">
        {value || "—"}
      </p>
    </div>
  );
}

function RelatedCard({ title, person }) {
  if (!person) return null;
  return (
    <div className="rounded-xl border border-ink-200/70 bg-white/70 px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
        {title}
      </p>
      <p className="mt-1 text-sm font-medium text-ink-900">
        {person.name || person.email}
      </p>
      {person.name ? (
        <p className="text-xs text-ink-500">{person.email}</p>
      ) : null}
      <p className="mt-1 text-xs capitalize text-ink-500">
        {formatRole(person.role)}
      </p>
    </div>
  );
}

export default function Profile() {
  const { user, refreshMe } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    country: user?.country || "",
    company: user?.company || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const [resetBusy, setResetBusy] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      country: user.country || "",
      company: user.company || "",
    });
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.patch("/api/admin/auth/me", form);
      await refreshMe();
      setMessage("Profile updated");
    } catch (err) {
      setError(errMessage(err));
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setPwError("");
    setPwMessage("");

    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }

    setPwBusy(true);
    try {
      const body = { password: passwordForm.password };
      if (user?.hasPassword) {
        body.currentPassword = passwordForm.currentPassword;
      }
      const { data } = await api.post("/api/admin/auth/me/password", body);
      await refreshMe();
      setPasswordForm({
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
      setPwMessage(data.message || "Password saved");
    } catch (err) {
      setPwError(errMessage(err));
    } finally {
      setPwBusy(false);
    }
  }

  async function sendResetEmail() {
    if (!user?.email) return;
    setPwError("");
    setPwMessage("");
    setResetBusy(true);
    try {
      await api.post("/api/auth/password-reset/request", {
        email: user.email,
      });
      setPwMessage(
        "If that account exists, a password reset link was sent to your email.",
      );
    } catch (err) {
      setPwError(errMessage(err));
    } finally {
      setResetBusy(false);
    }
  }

  const hasHierarchy =
    Boolean(user?.reseller) ||
    Boolean(user?.groupAdmin) ||
    Boolean(user?.parent);

  const expiresLabel = user?.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt).toLocaleString()
    : "Not set";

  return (
    <div className="page-enter max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
      </header>

      <section className="card space-y-4 p-5 stagger-1 page-enter">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <ReadOnlyField label="Email" value={user?.email} />
          <ReadOnlyField label="Role" value={formatRole(user?.role)} />
          <ReadOnlyField
            label="Subscription expires"
            value={expiresLabel}
          />
          <ReadOnlyField
            label="Subscription status"
            value={
              user?.subscriptionActive
                ? "Active"
                : user?.subscriptionExpiresAt
                  ? "Expired"
                  : "None"
            }
          />
        </div>

        {hasHierarchy ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <RelatedCard title="Reseller" person={user.reseller} />
            <RelatedCard title="Group admin" person={user.groupAdmin} />
            <RelatedCard title="Parent" person={user.parent} />
          </div>
        ) : null}
      </section>

      <section className="card space-y-3 p-5 stagger-2 page-enter">
        <h2 className="font-display text-lg font-semibold">
          Outlook add-in
        </h2>
        <p className="text-sm text-ink-600">
          Download the SecureDoc Outlook add-in package. Install{" "}
          <span className="font-medium text-ink-800">
            manifest.encryption.xml
          </span>{" "}
          via Outlook sideload.
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-600">
          <li>
            Open{" "}
            <a
              href="https://aka.ms/olksideload"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:underline"
            >
              aka.ms/olksideload
            </a>
          </li>
          <li>My add-ins → Add a custom add-in → Add from file</li>
          <li>Upload manifest.encryption.xml from the zip</li>
          <li>Refresh Outlook, then sign in from the SecureDoc pane</li>
        </ol>
        <a
          href="/downloads/SecureDoc-outlook-addin.zip"
          download="SecureDoc-outlook-addin.zip"
          className="btn-primary inline-flex items-center justify-center"
        >
          Download Outlook add-in (.zip)
        </a>
      </section>

      <form
        className="card space-y-3 p-5 stagger-3 page-enter"
        onSubmit={saveProfile}
      >
        <h2 className="font-display text-lg font-semibold">Basic details</h2>
        {["name", "phone", "country", "company"].map((key) => (
          <div key={key}>
            <label className="label" htmlFor={`profile-${key}`}>
              {key}
            </label>
            <input
              id={`profile-${key}`}
              className="input"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <button type="submit" className="btn-primary">
          Save profile
        </button>
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
      </form>

      <form
        className="card space-y-3 p-5 stagger-4 page-enter"
      >
     

        <div className="flex flex-wrap gap-2">
        
          {user?.email ? (
            <button
              type="button"
              className="btn-primary"
              disabled={resetBusy}
              onClick={sendResetEmail}
            >
              {resetBusy ? "Sending…" : "Set / Reset Password"}
            </button>
          ) : null}
        </div>

        {pwMessage ? (
          <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent-dark">
            {pwMessage}
          </p>
        ) : null}
        {pwError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
            {pwError}
          </p>
        ) : null}
      </form>
    </div>
  );
}
