"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  username: string;
  name: string;
  role: string;
  organization: string;
  clearanceLevel: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const DEFAULT_USER: AuthUser = {
  username: "admin",
  name: "Vijay Eswaran S",
  role: "Security Administrator",
  organization: "Microsoft Sentinel Triage",
  clearanceLevel: "Level 5 - Unrestricted",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check session storage on initial mount
    try {
      const storedAuth = sessionStorage.getItem("sentinel_authenticated");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
        setUser(DEFAULT_USER);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    username?: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for high-tech authentication simulation
    await new Promise((resolve) => setTimeout(resolve, 600));

    const trimmedUser = (username || "").trim().toLowerCase();
    const trimmedPass = (password || "").trim();

    // Accept "admin" / "admin", or if empty (using placeholders), or valid demo credentials
    if (
      (!trimmedUser && !trimmedPass) ||
      (trimmedUser === "admin" && trimmedPass === "admin") ||
      (trimmedUser === "admin" && !trimmedPass)
    ) {
      setIsAuthenticated(true);
      setUser(DEFAULT_USER);
      try {
        sessionStorage.setItem("sentinel_authenticated", "true");
      } catch {
        // ignore
      }
      return { success: true };
    }

    // If incorrect credentials provided
    return {
      success: false,
      error: "ACCESS DENIED: Unauthorized operator credentials. Incident SEC-AUTH-401 logged.",
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      sessionStorage.removeItem("sentinel_authenticated");
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
