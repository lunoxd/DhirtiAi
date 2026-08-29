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
    <div style={{ maxWidth: "540px", margin: "0 auto", padding: "40px 20px 64px 20px" }}>
      <div className="card" style={{ padding: "40px", backgroundColor: "#2b2d31", borderRadius: "var(--rounded-xl)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Sign in to Dhriti
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
            Select a panel for instant access or enter your credentials
          </p>
        </div>

        {/* 3-Panel Login Switcher - WHITE & BIGGER LOGOS */}
        <div style={{
          backgroundColor: "#1e1f22",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--rounded-lg)",
          padding: "16px",
          marginBottom: "24px"
        }}>
          <div style={{
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--primary)",
            marginBottom: "12px",
            textAlign: "center"
          }}>
            ⚡ 1-Click Panel Access
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {/* User Button */}
            <button
              type="button"
              onClick={() => handleQuickRoleLogin("USER")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 8px",
                height: "auto",
                gap: "8px",
                backgroundColor: "#2b2d31",
                border: "1px solid var(--hairline)"
              }}
            >
              <User size={26} color="#ffffff" />
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>User Panel</span>
              <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Survivor View</span>
            </button>

            {/* Doctor Button */}
            <button
              type="button"
              onClick={() => handleQuickRoleLogin("DOCTOR")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 8px",
                height: "auto",
                gap: "8px",
                backgroundColor: "#2b2d31",
                border: "1px solid var(--hairline)"
              }}
            >
              <Stethoscope size={26} color="#ffffff" />
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>Doctor Panel</span>
              <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Distress Triage</span>
            </button>

            {/* Admin Button */}
            <button
              type="button"
              onClick={() => handleQuickRoleLogin("ADMIN")}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 8px",
                height: "auto",
                gap: "8px",
                backgroundColor: "#2b2d31",
                border: "1px solid var(--hairline)"
              }}
            >
              <ShieldCheck size={26} color="#ffffff" />
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>Admin Panel</span>
              <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Control Center</span>
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--hairline)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>OR EMAIL LOGIN</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--hairline)" }} />
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(245, 36, 67, 0.18)",
            border: "1px solid var(--status-critical)",
            borderRadius: "var(--rounded-md)",
            padding: "12px 16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--status-critical)",
            fontSize: "14px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "18px" }}>
            <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>EMAIL ADDRESS</label>
            <input
              type="email"
              className="form-input"
              style={{ fontSize: "16px", padding: "12px 16px", backgroundColor: "#1e1f22", color: "#ffffff" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>PASSWORD</label>
            <input
              type="password"
              className="form-input"
              style={{ fontSize: "16px", padding: "12px 16px", backgroundColor: "#1e1f22", color: "#ffffff" }}
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
            style={{ fontSize: "16px", padding: "14px" }}
          >
            <LogIn size={18} />
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
