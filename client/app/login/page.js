"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogIn, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("survivor.demo@dhriti.org");
    setPassword("DhritiSafe2026!");
    setError("");
    setLoading(true);

    try {
      try {
        await login("survivor.demo@dhriti.org", "DhritiSafe2026!");
      } catch {
        // If demo user does not exist yet, auto-register
        const { apiAuth, setToken } = await import("../../lib/api");
        const res = await apiAuth.register("Alex (Survivor Demo)", "survivor.demo@dhriti.org", "DhritiSafe2026!");
        setToken(res.token);
        window.location.href = "/dashboard";
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Log in to access your confidential wellbeing check-ins
          </p>
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
            <span>{loading ? "Signing in..." : "Log In"}</span>
          </button>
        </form>

        {/* Demo Fast Login */}
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary btn-block"
            disabled={loading}
            style={{ borderColor: "var(--brand-primary)", color: "#ffffff" }}
          >
            <Sparkles size={16} color="var(--brand-primary)" />
            <span>Fill & Sign In with Demo Account</span>
          </button>
        </div>

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
