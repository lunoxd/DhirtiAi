"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiAuth, setToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem("dhriti_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiAuth.me();
        setUser(res.user);
      } catch (err) {
        console.warn("Session expired or invalid:", err.message);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiAuth.login(email, password);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password) => {
    const res = await apiAuth.register(name, email, password);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
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
