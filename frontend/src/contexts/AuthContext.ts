import { createContext } from "react";

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  handleLogin: (userData: { username: string; token: string }) => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  handleLogin: () => {},
  handleLogout: () => {},
});
