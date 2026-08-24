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
      setError("You must accept the Terms & Conditions to create an account");
      return;
    }
    try {
      const { data } = await api.post("/api/admin/invitations/accept", {
        token,
        password,
        name,
        acceptTerms: true,
      });
      if (
        ["reseller", "group_admin", "super_admin", "subscriber"].includes(
          data.user?.role,
        )
      ) {
        await refreshMe();
        navigate("/");
      } else {
        setError(
          "Account created. Open the SecureDocShare extension to log in and decrypt mail.",
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
        <h1 className="mt-2 text-lg font-semibold">Accept invitation</h1>
        {preview && (
          <p className="mt-1 text-sm text-ink-500">
            {preview.email} · {preview.role} · {preview.trialDays || 90}-day
            subscription
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label">Display name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Password (12+ characters)</label>
            <input
              className="input"
              type="password"
              minLength={12}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
