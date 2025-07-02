import React from "react";
import { createContext, useState, useEffect, type ReactNode } from "react";

export type User = {
  id: string;
  username: string;
  email: string;
  token: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLogin: (userData: User) => void;
  handleLogout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  handleLogin: () => {},
  handleLogout: () => {},
  checkAuthStatus: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is authenticated on app startup
  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          token: token,
        });
      } else {
        // Token is invalid, clear it
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user login
  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
  };

  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout,
    checkAuthStatus,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};
