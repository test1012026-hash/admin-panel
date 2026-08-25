import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  api,
  clearLegacyAuthStorage,
  errMessage,
  setAuthExpiredHandler,
} from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  const clearClientAuth = useCallback(() => {
    setUser(null);
    setSettings(null);
    setSession(null);
  }, []);

  const refreshMe = useCallback(async () => {
    const { data } = await api.get("/api/admin/auth/me");
    setUser(data.user);
    setSettings(data.settings || null);
    setSession(data.session || null);
    return data;
  }, []);

  async function login({ email, password }) {
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/auth/login", {
        email,
        password,
      });
      setUser(data.user);
      setSettings(data.settings || null);
      setSession(data.session || null);
      await refreshMe().catch(() => {});
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function signup({ email, password, acceptTerms, otp }) {
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/auth/signup", {
        email,
        password,
        acceptTerms,
        otp,
      });
      setUser(data.user);
      setSettings(data.settings || null);
      setSession(data.session || null);
      await refreshMe().catch(() => {});
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function sendSignupOtp({ email, acceptTerms }) {
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/auth/signup/send-otp", {
        email,
        acceptTerms,
      });
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function completeSso(ticket) {
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/auth/oauth/complete", {
        ticket,
      });
      setUser(data.user);
      setSettings(data.settings || null);
      setSession(data.session || null);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await api.post("/api/admin/auth/logout");
    } catch {
      await api.post("/api/admin/auth/logout-local").catch(() => {});
    } finally {
      clearClientAuth();
    }
  }

  useEffect(() => {
    clearLegacyAuthStorage();
    setAuthExpiredHandler(({ soft } = {}) => {
      clearClientAuth();
      if (!soft) {
        api.post("/api/admin/auth/logout-local").catch(() => {});
      }
    });

    let cancelled = false;
    (async () => {
      try {
        await refreshMe();
      } catch {
        if (!cancelled) clearClientAuth();
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
      setAuthExpiredHandler(null);
    };
  }, [clearClientAuth, refreshMe]);

  const value = useMemo(
    () => ({
      user,
      settings,
      session,
      loading,
      bootstrapping,
      isAuthenticated: Boolean(user),
      login,
      signup,
      sendSignupOtp,
      completeSso,
      logout,
      refreshMe,
      errMessage,
    }),
    [user, settings, session, loading, bootstrapping, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
