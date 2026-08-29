"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, AlertCircle, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow" style={{ paddingTop: "32px", paddingBottom: "64px" }}>
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Your check-ins are strictly confidential and protected
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "var(--rounded-md)",
            padding: "12px 16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--error)",
            fontSize: "13px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Preferred Name or Alias</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya or Anonymous"
              required
            />
          </div>

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
            <label className="form-label">Password (min 6 characters)</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: "12px" }}
          >
            <UserPlus size={16} />
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        <div style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center",
          fontSize: "12px",
          color: "var(--text-muted)"
        }}>
          <ShieldCheck size={14} color="var(--status-stable)" />
          <span>You can wipe your data at any time from Settings & Privacy</span>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "underline" }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
