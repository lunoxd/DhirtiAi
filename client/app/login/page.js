"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogIn, AlertCircle } from "lucide-react";

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

  return (
    <div style={{ maxWidth: "540px", margin: "0 auto", padding: "48px 20px 64px 20px" }}>
      <div className="card" style={{ padding: "40px", backgroundColor: "#2b2d31", borderRadius: "var(--rounded-xl)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Sign in to Dhriti
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
            Enter your credentials to access your account
          </p>
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
          <div className="form-group" style={{ marginBottom: "20px" }}>
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

          <div className="form-group" style={{ marginBottom: "28px" }}>
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

        <div style={{ textAlign: "center", marginTop: "28px", fontSize: "14px", color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  );
}
