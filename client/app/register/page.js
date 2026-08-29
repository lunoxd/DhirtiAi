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
    <div className="container-narrow" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Create Your Private Account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Your check-ins are strictly private and protected
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
          <Link href="/login" style={{ color: "var(--brand-primary)", fontWeight: 600 }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
