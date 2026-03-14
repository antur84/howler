import { useCallback, useEffect, useState, type ReactNode } from "react";
import { logout as apiLogout, fetchCurrentUser, verifyGoogleCredential } from "./api";
import { AuthContext } from "./AuthContext";
import type { User } from "./types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    const u = await verifyGoogleCredential(credential);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, handleGoogleSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
