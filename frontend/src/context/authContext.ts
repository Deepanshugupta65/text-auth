import { createContext } from "react";
import type { AuthCredentials } from "../api/authApi";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);