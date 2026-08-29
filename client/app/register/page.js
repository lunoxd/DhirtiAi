"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiAuth } from "../../lib/api";
import { UserPlus, AlertCircle, ShieldCheck, Mail, CheckCircle2, Send, KeyRound } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid Gmail address first.");
      return;
    }

    setError("");
    setSendingOtp(true);
    setOtpMessage("");

    try {
      const res = await apiAuth.sendOTP(email);
      setOtpSent(true);
      setOtpMessage(res.message || `Verification code sent to ${email} via Resend.com`);
    } catch (err) {
      setError(err.message || "Failed to send verification email via Resend.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.trim().length < 4) {
      setError("Please enter the 6-digit code sent to your Gmail.");
      return;
    }

    setError("");
    setVerifyingOtp(true);

    try {
      await apiAuth.verifyOTP(email, otpCode);
      setOtpVerified(true);
      setOtpMessage("✓ Gmail address verified successfully!");
    } catch (err) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, "USER", "", "", otpCode);
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
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Sign up with Gmail verification powered by Resend.com
          </p>
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

        {otpMessage && (
          <div style={{
            backgroundColor: "rgba(35, 165, 90, 0.15)",
            border: "1px solid var(--status-stable)",
            borderRadius: "var(--rounded-md)",
            padding: "12px 16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--status-stable)",
            fontSize: "13px",
            fontWeight: 600
          }}>
            <CheckCircle2 size={16} />
            <span>{otpMessage}</span>
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
            <label className="form-label">Gmail / Email Address</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="email"
                className="form-input"
                style={{ flex: 1 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                disabled={otpVerified}
                required
              />
              {!otpVerified && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={sendingOtp || !email}
                  className="btn btn-secondary btn-sm"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <Send size={14} color="var(--primary)" />
                  <span>{sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}</span>
                </button>
              )}
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              Powered by Resend.com email delivery
            </span>
          </div>

          {/* OTP Input Section */}
          {otpSent && !otpVerified && (
            <div className="card-inner" style={{ marginBottom: "18px", backgroundColor: "var(--surface-soft)" }}>
              <label className="form-label" style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                <KeyRound size={14} /> Enter 6-Digit Gmail Code
              </label>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, letterSpacing: "4px", fontSize: "16px", fontWeight: 700, textAlign: "center" }}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={verifyingOtp || otpCode.length < 4}
                  className="btn btn-primary btn-sm"
                >
                  {verifyingOtp ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            </div>
          )}

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
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
