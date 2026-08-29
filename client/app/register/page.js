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
      await register(name, email, password, "USER", "", "");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "540px", margin: "0 auto", padding: "40px 20px 64px 20px" }}>
      <div className="card" style={{ padding: "40px", backgroundColor: "#2b2d31", borderRadius: "var(--rounded-xl)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
            Instant sign up to track your daily Dhriti Index & wellbeing trends
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
          <div className="form-group" style={{ marginBottom: "18px" }}>
            <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>PREFERRED NAME OR ALIAS</label>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: "16px", padding: "12px 16px", backgroundColor: "#1e1f22", color: "#ffffff" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya or Anonymous"
              required
            />
          </div>

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
            <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>PASSWORD (MIN 6 CHARACTERS)</label>
            <input
              type="password"
              className="form-input"
              style={{ fontSize: "16px", padding: "12px 16px", backgroundColor: "#1e1f22", color: "#ffffff" }}
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
            style={{ fontSize: "16px", padding: "14px" }}
          >
            <UserPlus size={18} />
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        <div style={{
          marginTop: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center",
          fontSize: "12.5px",
          color: "var(--text-muted)"
        }}>
          <ShieldCheck size={15} color="var(--status-stable)" />
          <span>You can wipe your data at any time from Settings & Privacy</span>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
