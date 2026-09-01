import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, errMessage } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import { TermsCheckbox } from "../lib/sso.jsx";

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const { refreshMe } = useAuth();
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Missing invite token");
      return;
    }
    api
      .get(`/api/admin/invitations/accept/${token}`)
      .then((res) => setPreview(res.data))
      .catch((err) => setError(errMessage(err)));
  }, [token]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!acceptTerms) {
      setError("You must accept the Terms & Conditions");
      return;
    }
    try {
      const { data } = await api.post("/api/admin/invitations/accept", {
        token,
        password: password || undefined,
        name,
        acceptTerms: true,
      });
      if (
        ["reseller", "group_admin", "super_admin", "subscriber"].includes(
          data.user?.role,
        )
      ) {
        await refreshMe();
        navigate(data?.user?.role === "subscriber" ? "/profile" : "/dashboard");
      } else {
        setError(
          data.isExistingUser
            ? "Invitation accepted! You have been added to the group."
            : "Account created. Open the SecureDocShare extension to log in and decrypt mail.",
        );
      }
    } catch (err) {
      setError(errMessage(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <p className="font-display text-2xl font-bold">SecureDocShare</p>
        <h1 className="mt-2 text-lg font-semibold">
          {preview?.isExistingUser ? "Join group invitation" : "Accept invitation"}
        </h1>
        {preview && (
          <div className="mt-2 rounded-lg bg-ink-50/80 p-3 text-xs text-ink-600 space-y-1 border border-ink-100">
            <p><strong>Email:</strong> {preview.email}</p>
            <p><strong>Role:</strong> <span className="capitalize">{preview.role?.replace(/_/g, " ")}</span></p>
            {preview.groupName && <p><strong>Group:</strong> {preview.groupName}</p>}
            {preview.isExistingUser ? (
              <p className="text-teal-700 font-medium pt-1">
                You have an existing account. Accepting will add your account to this group.
              </p>
            ) : (
              <p className="text-ink-500 pt-1">
                New accounts receive a {preview.trialDays || 90}-day subscription.
              </p>
            )}
            <p className="text-amber-700 font-medium text-[11px] pt-1">
              Valid for 24 hours only.
            </p>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label">Display name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="label">
              {preview?.isExistingUser
                ? "Update password (optional — 12+ characters)"
                : "Password (12+ characters)"}
            </label>
            <input
              className="input"
              type="password"
              minLength={12}
              required={!preview?.isExistingUser}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={preview?.isExistingUser ? "Leave blank to keep current password" : "Create strong password"}
            />
          </div>
          <TermsCheckbox
            id="invite-accept-terms"
            checked={acceptTerms}
            onChange={setAcceptTerms}
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={!preview || !acceptTerms}
          >
            {preview?.isExistingUser ? "Join group & Accept" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
