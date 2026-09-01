import { Link } from "react-router-dom";

export const SSO_PROVIDER_META = {
  google: {
    label: "Continue with Google",
    className:
      "border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
        />
        <path
          fill="#34A853"
          d="M6.6 14.3l-.9.7-2.5 1.9C4.8 19.4 8.1 21.5 12 21.5c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.9-6-4.4z"
        />
        <path
          fill="#4A90E2"
          d="M3.2 7.1C2.4 8.6 2 10.2 2 12s.4 3.4 1.2 4.9l3.4-2.6C6.2 13.4 6 12.7 6 12s.2-1.4.6-2.3L3.2 7.1z"
        />
        <path
          fill="#FBBC05"
          d="M12 5.5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.9 2.4 14.7 1.5 12 1.5 8.1 1.5 4.8 3.6 3.2 7.1l3.4 2.6C7 7.3 9.2 5.5 12 5.5z"
        />
      </svg>
    ),
  },
  microsoft: {
    label: "Continue with Microsoft",
    className:
      "border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden="true">
        <path fill="#f25022" d="M1 1h10v10H1z" />
        <path fill="#00a4ef" d="M12 1h10v10H12z" />
        <path fill="#7fba00" d="M1 12h10v10H1z" />
        <path fill="#ffb900" d="M12 12h10v10H12z" />
      </svg>
    ),
  },
  yahoo: {
    label: "Continue with Yahoo",
    className:
      "border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#6001D2"
          d="M12.2 2.5 7.4 14.1H4.8L9.6 2.5h2.6zm2.4 0 4.8 11.6h-2.6L12 2.5h2.6zM11 15.2c.9 0 1.6.7 1.6 1.6S11.9 18.4 11 18.4s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6z"
        />
      </svg>
    ),
  },
};

export function startAdminSso(provider, { intent = "login", acceptTerms = false } = {}) {
  const returnOrigin = window.location.origin;
  const returnPath = window.location.pathname || "/login";
  const params = new URLSearchParams({
    returnOrigin,
    returnPath,
    intent,
  });
  if (intent === "signup") {
    params.set("acceptTerms", acceptTerms ? "1" : "0");
  }

  // Yahoo cannot use http:// callbacks. Start OAuth on the HTTPS hub so
  // authorize state is signed+verified on the same host (Vercel).
  const hubBase = String(import.meta.env.VITE_OAUTH_HUB_URL || "").replace(
    /\/$/,
    "",
  );
  const isLocalAdmin =
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(returnOrigin);

  let apiBase = "";
  if (provider === "yahoo" && hubBase && isLocalAdmin) {
    // Yahoo rejects http:// callbacks; local admin still starts on the HTTPS API.
    apiBase = hubBase;
  }

  window.location.href = `${apiBase}/api/admin/auth/oauth/${provider}/start?${params.toString()}`;
}

export function TermsCheckbox({ checked, onChange, id = "accept-terms" }) {
  return (
    <label className="flex items-start gap-2.5 text-sm text-ink-700" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-ink-300 text-accent focus:ring-accent"
        checked={checked}
        required
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        I agree to the{" "}
        <Link to="/terms" className="font-semibold text-accent hover:underline">
          Terms &amp; Conditions
        </Link>{" "}
        <span className="text-danger">*</span>
      </span>
    </label>
  );
}
