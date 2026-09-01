import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { api, errMessage } from "../lib/api";
import { SSO_PROVIDER_META, startAdminSso } from "../lib/sso.jsx";
import PublicMarketingLinks from "../components/PublicMarketingLinks.jsx";

export default function Login() {
  const {
    login,
    completeSso,
    isAuthenticated,
    loading,
    bootstrapping,
    user,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [providers, setProviders] = useState([]);
  const [ssoBusy, setSsoBusy] = useState("");
  const homePath = user?.role === "subscriber" ? "/profile" : "/dashboard";
  const busy = loading || Boolean(ssoBusy);

  useEffect(() => {
    api
      .get("/api/admin/auth/oauth/providers")
      .then((res) => setProviders(res.data.providers || []))
      .catch(() => setProviders([]));
  }, []);

  useEffect(() => {
    const ssoError = searchParams.get("sso_error");
    if (ssoError) {
      setError(ssoError);
      const next = new URLSearchParams(searchParams);
      next.delete("sso_error");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const ticket = searchParams.get("sso_ticket");
    if (!ticket || bootstrapping) return undefined;

    let cancelled = false;
    (async () => {
      setSsoBusy("sso");
      setError("");
      try {
        const data = await completeSso(ticket);
        if (cancelled) return;
        navigate(
          data?.user?.needsOnboarding
            ? "/onboarding"
            : data?.user?.role === "subscriber"
              ? "/profile"
              : "/dashboard",
          {
          replace: true,
        });
      } catch (err) {
        if (!cancelled) setError(errMessage(err));
      } finally {
        if (!cancelled) {
          setSsoBusy("");
          const nextParams = new URLSearchParams(searchParams);
          nextParams.delete("sso_ticket");
          nextParams.delete("next");
          setSearchParams(nextParams, { replace: true });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootstrapping]);

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-500">
        Loading…
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to={homePath} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ email, password });
      navigate(
        data?.user?.needsOnboarding
          ? "/onboarding"
          : data?.user?.role === "subscriber"
            ? "/profile"
            : "/dashboard",
      );
    } catch (err) {
      setError(errMessage(err));
    }
  }

  function startSso(provider) {
    setError("");
    setSsoBusy(provider);
    startAdminSso(provider, { intent: "login" });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
        style={{ animation: "soft-pulse 5s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl"
        style={{ animation: "soft-pulse 6s ease-in-out infinite 0.8s" }}
      />

      <div className="card page-enter relative w-full max-w-md overflow-hidden p-8 shadow-lift">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/30">
              <span className="font-display text-sm font-bold">SD</span>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-ink-950">
                SecureDocShare
              </p>
            </div>
          </Link>
        </div>

        <h1 className="text-lg font-semibold text-ink-800">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-500">
          Sign in with SSO or email and password (12+ characters).
        </p>

        {providers.length > 0 ? (
          <div className="mt-6 space-y-2.5">
            {providers.map((provider) => {
              const meta = SSO_PROVIDER_META[provider];
              if (!meta) return null;
              return (
                <button
                  key={provider}
                  type="button"
                  disabled={busy}
                  onClick={() => startSso(provider)}
                  className={[
                    "flex w-full items-center justify-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                    meta.className,
                  ].join(" ")}
                >
                  {meta.icon}
                  {ssoBusy === provider ? "Redirecting…" : meta.label}
                </button>
              );
            })}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide">
                <span className="bg-white px-2 text-ink-400">or</span>
              </div>
            </div>
          </div>
        ) : null}

        <form className="mt-2 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={12}
            />
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <button className="btn-primary w-full" type="submit" disabled={busy}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-500">
          Need an account?{" "}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            Sign up
          </Link>
        </p>
        <PublicMarketingLinks />
      </div>
    </div>
  );
}
