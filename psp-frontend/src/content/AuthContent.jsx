import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL ?? "";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(payload.message ?? "Credenciais inválidas");
    }

    const accessToken = payload?.data?.accessToken;
    const authUser = payload?.data?.user;

    if (!accessToken) {
      throw new Error("Resposta inválida do servidor");
    }

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(authUser ?? {}));
    setToken(accessToken);
    setUser(authUser ?? {});
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(payload.message ?? "Erro ao criar conta");
    }

    const accessToken = payload?.data?.accessToken;
    const authUser = payload?.data?.user;

    if (!accessToken) {
      throw new Error("Resposta inválida do servidor");
    }

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(authUser ?? {}));
    setToken(accessToken);
    setUser(authUser ?? {});
  }, []);

  const fetchMe = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      return null;
    }

    const payload = await res.json();
    const me = payload?.data ?? null;

    if (me) {
      localStorage.setItem("user", JSON.stringify(me));
      setUser(me);
    }

    return me;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};