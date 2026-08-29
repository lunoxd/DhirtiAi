"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogIn, AlertCircle, Sparkles, Stethoscope, ShieldCheck, User } from "lucide-react";

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
    <div className="container-narrow" style={{ paddingTop: "30px", paddingBottom: "60px" }}>
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Sign In to DHRITI
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Select your role or enter your credentials
          </p>
        </div>

        {/* 1-Click Role Demonstrator Bar */}
        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          border: "1px solid var(--border-card)",
          borderRadius: "var(--radius-lg)",
          padding: "16px",
          marginBottom: "24px"
        }}>
          <div style={{
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
            marginBottom: "10px",
            textAlign: "center"
          }}>
            ⚡ 1-Click Panel Access (Live Demo)
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            <button
              type="button"
              onClick={() => handleQuickRoleLogin("USER")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", flexDirection: "column", padding: "10px 6px", height: "auto", gap: "4px" }}
            >
              <User size={18} color="var(--brand-primary)" />
              <span style={{ fontSize: "12px", fontWeight: 700 }}>1. User Panel</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Survivor Check-in</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin("DOCTOR")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", flexDirection: "column", padding: "10px 6px", height: "auto", gap: "4px", borderColor: "rgba(88, 101, 242, 0.4)" }}
            >
              <Stethoscope size={18} color="var(--status-stable)" />
              <span style={{ fontSize: "12px", fontWeight: 700 }}>2. Doctor / Helpline</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Distress Triage</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin("ADMIN")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", flexDirection: "column", padding: "10px 6px", height: "auto", gap: "4px", borderColor: "rgba(240, 178, 50, 0.4)" }}
            >
              <ShieldCheck size={18} color="var(--status-elevated)" />
              <span style={{ fontSize: "12px", fontWeight: 700 }}>3. Admin Panel</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Full Overview</span>
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Or Manual Login</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(242, 63, 67, 0.15)",
            border: "1px solid var(--status-critical)",
            borderRadius: "var(--radius-md)",
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
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--brand-primary)", fontWeight: 600 }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
