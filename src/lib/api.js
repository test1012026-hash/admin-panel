import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let onAuthExpired = null;

/** Auth provider registers a handler so we clear React state without localStorage. */
export function setAuthExpiredHandler(handler) {
  onAuthExpired = handler;
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const code = err.response?.data?.code;
    const url = err.config?.url || "";
    const isAuthBootstrap =
      url.includes("/admin/auth/login") ||
      url.includes("/admin/auth/logout") ||
      url.includes("/admin/auth/me");
    const needsRelogin =
      !url.includes("/admin/auth/login") &&
      (status === 440 ||
        status === 401 ||
        code === "RELOGIN_REQUIRED" ||
        code === "TOKEN_EXPIRED" ||
        code === "TOKEN_INVALID");
    if (needsRelogin) {
      if (typeof onAuthExpired === "function") {
        onAuthExpired({ soft: isAuthBootstrap && url.includes("/admin/auth/me") });
      }
      if (
        !url.includes("/admin/auth/me") &&
        !url.includes("/admin/auth/login") &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/accept-invite")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export function errMessage(err) {
  return err?.response?.data?.error || err?.message || "Request failed";
}

/** Drop any legacy localStorage auth keys from older builds. */
export function clearLegacyAuthStorage() {
  try {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh");
    localStorage.removeItem("admin_user");
  } catch {
    /* ignore */
  }
}
