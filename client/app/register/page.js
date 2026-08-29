"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, AlertCircle, ShieldCheck, User, Stethoscope, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [organization, setOrganization] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await register(name, email, password, role, organization, specialization);
      
      if (role === "DOCTOR") {
        setSuccessMsg("Doctor registration submitted! Your account is pending Admin approval before you can sign in.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px 64px 20px" }}>
      <div className="card" style={{ padding: "40px", backgroundColor: "#2b2d31", borderRadius: "var(--rounded-xl)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
            Select your account type to register on Dhriti
          </p>
        </div>

        {/* Role Switcher: USER vs DOCTOR (ADMIN is excluded) */}
        <div style={{
          backgroundColor: "#1e1f22",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--rounded-lg)",
          padding: "14px",
          marginBottom: "24px"
        }}>
          <div style={{
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--primary)",
            marginBottom: "10px",
            textAlign: "center"
          }}>
            SELECT ACCOUNT ROLE
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setRole("USER")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 8px",
                borderRadius: "var(--rounded-md)",
                border: role === "USER" ? "2px solid var(--primary)" : "1px solid var(--hairline)",
                backgroundColor: role === "USER" ? "rgba(245, 36, 67, 0.15)" : "#2b2d31",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <User size={24} color="#ffffff" style={{ marginBottom: "4px" }} />
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>User / Survivor</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Instant Check-in & Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("DOCTOR")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 8px",
                borderRadius: "var(--rounded-md)",
                border: role === "DOCTOR" ? "2px solid var(--primary)" : "1px solid var(--hairline)",
                backgroundColor: role === "DOCTOR" ? "rgba(245, 36, 67, 0.15)" : "#2b2d31",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Stethoscope size={24} color="#ffffff" style={{ marginBottom: "4px" }} />
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>Doctor / Responder</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Requires Admin Approval</span>
            </button>
          </div>
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

        {successMsg && (
          <div style={{
            backgroundColor: "rgba(35, 165, 90, 0.18)",
            border: "1px solid var(--status-stable)",
            borderRadius: "var(--rounded-md)",
            padding: "14px 16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            color: "var(--status-stable)",
            fontSize: "14px",
            lineHeight: "1.5"
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ color: "#ffffff" }}>Registration Submitted!</strong>
              <p style={{ marginTop: "2px" }}>{successMsg}</p>
            </div>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "18px" }}>
              <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                FULL NAME OR ALIAS
              </label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: "16px", padding: "12px 16px", backgroundColor: "#1e1f22", color: "#ffffff" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya or Dr. Ananya Sharma"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "18px" }}>
              <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                EMAIL ADDRESS
              </label>
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

            <div className="form-group" style={{ marginBottom: role === "DOCTOR" ? "18px" : "24px" }}>
              <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                PASSWORD (MIN 6 CHARACTERS)
              </label>
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

            {/* Doctor-Specific Fields */}
            {role === "DOCTOR" && (
              <>
                <div className="form-group" style={{ marginBottom: "18px" }}>
                  <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                    HOSPITAL / ORGANIZATION NAME
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: "16px", padding: "12px 16px", backgroundColor: "#1e1f22", color: "#ffffff" }}
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. NIMHANS / Tele-MANAS Partner Hospital"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label className="form-label" style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                    CLINICAL SPECIALIZATION
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: "16px", padding: "12px 16px", backgroundColor: "#1e1f22", color: "#ffffff" }}
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Trauma & Crisis Psychologist"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ fontSize: "16px", padding: "14px" }}
            >
              <UserPlus size={18} />
              <span>{loading ? "Registering..." : role === "DOCTOR" ? "Submit Doctor Registration" : "Create User Account"}</span>
            </button>
          </form>
        )}

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
          <span>Admin Account (chiru@gmail.com) manages system approvals</span>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Already registered?{" "}
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
