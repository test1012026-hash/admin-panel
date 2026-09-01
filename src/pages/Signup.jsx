import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { api, errMessage } from "../lib/api";
import {
  SSO_PROVIDER_META,
  startAdminSso,
  TermsCheckbox,
} from "../lib/sso.jsx";
import PublicMarketingLinks from "../components/PublicMarketingLinks.jsx";

export default function Signup() {
  const {
    signup,
    sendSignupOtp,
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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpHint, setOtpHint] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState([]);
  const [ssoBusy, setSsoBusy] = useState("");

  const homePath = user?.role === "subscriber" ? "/profile" : "/dashboard";
  const termsBlocked = !acceptTerms;
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
          { replace: true },
        );
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
    if (!acceptTerms) {
      setError("You must accept the Terms & Conditions to sign up");
      return;
    }
    try {
      if (!otpSent) {
        if (String(password || "").length < 12) {
          setError("Password must be at least 12 characters");
          return;
        }
        const result = await sendSignupOtp({ email, acceptTerms: true });
        setOtpSent(true);
        setOtp("");
        setOtpHint(
          result?.devOtp
            ? `Dev code: ${result.devOtp} (valid 10 min)`
            : "Code sent. Valid for 10 minutes — a new request replaces the old code.",
        );
        return;
      }
      if (!/^\d{4}$/.test(String(otp).trim())) {
        setError("Enter the 4-digit verification code");
        return;
      }
      const data = await signup({
        email,
        password,
        acceptTerms: true,
        otp: String(otp).trim(),
      });
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

  async function onResendOtp() {
    setError("");
    try {
      const result = await sendSignupOtp({ email, acceptTerms: true });
      setOtpHint(
        result?.devOtp
          ? `Dev code: ${result.devOtp} (valid 10 min)`
          : "New code sent. Valid for 10 minutes — previous code is invalid.",
      );
    } catch (err) {
      setError(errMessage(err));
    }
  }

  function startSso(provider) {
    setError("");
    if (!acceptTerms) {
      setError("You must accept the Terms & Conditions to sign up");
      return;
    }
    setSsoBusy(provider);
    startAdminSso(provider, { intent: "signup", acceptTerms: true });
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

        <h1 className="text-lg font-semibold text-ink-800">Sign up</h1>
        <p className="mt-1 text-sm text-ink-500">
          Create an account with SSO or email and password (12+ characters).
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
                  disabled={busy || termsBlocked}
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
            <div className="text-sm text-ink-500">
              * Select Terms & Conditions to sign up
            </div>

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
            <label className="label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className="input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setOtpSent(false);
                setOtp("");
                setOtpHint("");
              }}
              required
              disabled={otpSent && busy}
            />
          </div>
          <div>
            <label className="label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="input"
              type="password"
              autoComplete="new-password"
              placeholder="At least 12 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={12}
            />
          </div>
          <TermsCheckbox
            id="signup-accept-terms"
            checked={acceptTerms}
            onChange={setAcceptTerms}
          />
          {otpSent ? (
            <div>
              <label className="label" htmlFor="signup-otp">
                4-digit verification code
              </label>
              <input
                id="signup-otp"
                className="input tracking-[0.35em]"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={4}
                pattern="\d{4}"
                placeholder="••••"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                required
              />
              {otpHint ? (
                <p className="mt-1.5 text-xs text-ink-500">{otpHint}</p>
              ) : null}
              <button
                type="button"
                className="mt-2 text-sm font-semibold text-accent hover:underline disabled:opacity-50"
                onClick={onResendOtp}
                disabled={busy || termsBlocked}
              >
                Resend code
              </button>
            </div>
          ) : null}
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={busy || termsBlocked}
          >
            {loading
              ? otpSent
                ? "Creating account…"
                : "Sending code…"
              : otpSent
                ? "Verify & sign up"
                : "Send verification code"}
          </button>
          {otpSent ? (
            <button
              type="button"
              className="w-full text-sm font-semibold text-ink-500 hover:underline"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setOtpHint("");
                setError("");
              }}
            >
              Change email
            </button>
          ) : null}
        </form>

        <p className="mt-4 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-accent hover:underline"
          >
            Log in
          </Link>
        </p>
        <PublicMarketingLinks />
      </div>
    </div>
  );
}
