import { createContext } from "react";
import type { User } from "./types";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  handleGoogleSuccess: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
