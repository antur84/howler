import { useCallback, useEffect, useState } from "react";
import { fetchCurrentUser, logout, verifyGoogleCredential } from "./api";
import type { User } from "./types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if user is already authenticated via cookie.
  useEffect(() => {
    fetchCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const handleGoogleSuccess = useCallback(
    async (credential: string) => {
      const u = await verifyGoogleCredential(credential);
      setUser(u);
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  return { user, loading, handleGoogleSuccess, logout: handleLogout };
}
