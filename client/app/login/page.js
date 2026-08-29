"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogIn, AlertCircle, Stethoscope, ShieldCheck, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === "ADMIN") {
        router.push("/admin");
      } else if (loggedInUser.role === "DOCTOR") {
        router.push("/doctor");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = async (role) => {
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await loginDemo(role);
      if (loggedInUser.role === "ADMIN") {
        router.push("/admin");
      } else if (loggedInUser.role === "DOCTOR") {
        router.push("/doctor");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || `Failed to sign in as ${role}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow" style={{ paddingTop: "32px", paddingBottom: "64px" }}>
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Sign in to Dhriti
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Select your panel for instant login or enter account credentials
          </p>
        </div>

        {/* 3-Panel Quick Access Login */}
        <div style={{
          backgroundColor: "var(--surface-soft)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--rounded-lg)",
          padding: "16px",
          marginBottom: "24px"
        }}>
          <div style={{
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--primary)",
            marginBottom: "10px",
            textAlign: "center"
          }}>
            ⚡ 1-Click Panel Access System
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            <button
              type="button"
              onClick={() => handleQuickRoleLogin("USER")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", flexDirection: "column", padding: "12px 6px", height: "auto", gap: "4px" }}
            >
              <User size={18} color="var(--primary)" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>1. Survivor Panel</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>User Check-in</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin("DOCTOR")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", flexDirection: "column", padding: "12px 6px", height: "auto", gap: "4px" }}
            >
              <Stethoscope size={18} color="var(--status-stable)" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>2. Doctor Panel</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Distress Triage</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin("ADMIN")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", flexDirection: "column", padding: "12px 6px", height: "auto", gap: "4px" }}
            >
              <ShieldCheck size={18} color="var(--primary)" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>3. Admin Panel</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>System Control</span>
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--hairline)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>OR SIGN IN WITH EMAIL</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--hairline)" }} />
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(242, 63, 67, 0.15)",
            border: "1px solid var(--status-critical)",
            borderRadius: "var(--rounded-md)",
            padding: "12px 16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--status-critical)",
            fontSize: "13px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: "12px" }}
          >
            <LogIn size={16} />
            <span>{loading ? "Signing in..." : "Sign in"}</span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  );
}
