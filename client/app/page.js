"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  CheckCircle2,
  Activity,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Stethoscope,
  ShieldAlert,
  User,
  LayoutDashboard
} from "lucide-react";
import DisclaimerBanner from "../components/DisclaimerBanner";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("survivor");

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      backgroundColor: "#313338",
      color: "#dbdee1",
      position: "relative",
      overflowX: "hidden"
    }}>
      {/* Ambient Radial Lighting Glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "1100px",
        height: "550px",
        background: "radial-gradient(circle, rgba(245, 36, 67, 0.14) 0%, rgba(49, 51, 56, 0) 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "24px", paddingBottom: "64px" }}>
        
        {/* 1. HERO SECTION - BALANCED PROPORTIONS */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "40px",
          alignItems: "center",
          padding: "48px 0 64px 0"
        }}>
          {/* Left Headline Column */}
          <div>
            <div className="nav-pill-group" style={{ marginBottom: "20px", backgroundColor: "#1e1f22" }}>
              <span className="badge" style={{ backgroundColor: "var(--primary)", color: "#ffffff", padding: "3px 10px", fontSize: "11px", fontWeight: 800 }}>
                DHRITI PLATFORM
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", paddingRight: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={13} color="var(--primary)" /> AI-Assisted Early Distress Support
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              marginBottom: "20px"
            }}>
              Understand your wellbeing.<br />
              <span style={{ color: "var(--primary)" }}>Recognize changes early.</span>
            </h1>

            <p style={{
              fontSize: "16px",
              color: "#dbdee1",
              lineHeight: "1.6",
              marginBottom: "32px",
              fontWeight: 400,
              maxWidth: "520px"
            }}>
              A calm, accessible platform for monitoring emotional health. Track changes over time with a deterministic 0–100 Dhriti Index, Groq AI guidance, and 24/7 crisis support.
            </p>

            {/* Action Row - "Live Demo Access" Removed */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href={isAuthenticated ? "/dashboard" : "/register"}
                className="btn btn-primary btn-lg"
                style={{ fontSize: "16px", padding: "14px 32px", boxShadow: "0 8px 24px rgba(245, 36, 67, 0.35)" }}
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Start Free Check-in"}</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "28px", fontSize: "13px", color: "var(--text-muted)", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ffffff", fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--status-stable)" /> 100% Free & Anonymous
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ffffff", fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--status-stable)" /> Non-Diagnostic Tool
              </span>
            </div>
          </div>

          {/* Right Column: Balanced Product Preview Card */}
          <div style={{
            backgroundColor: "#2b2d31",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--rounded-xl)",
            padding: "24px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
            position: "relative"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-stable)", boxShadow: "0 0 8px var(--status-stable)" }} />
                <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#ffffff" }}>
                  LIVE MONITORING PREVIEW
                </span>
              </div>
              <span className="badge badge-stable" style={{ fontSize: "11px", padding: "2px 8px" }}>Dhriti Index 24</span>
            </div>

            {/* Score Display Card */}
            <div style={{
              backgroundColor: "#1e1f22",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--rounded-lg)",
              padding: "20px",
              textAlign: "center",
              marginBottom: "16px"
            }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                DHRITI WELLBEING INDEX
              </div>
              <div style={{ fontSize: "48px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", margin: "4px 0", lineHeight: 1 }}>
                24<span style={{ fontSize: "18px", color: "var(--text-muted)", fontWeight: 600 }}>/100</span>
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--status-stable)", fontWeight: 700 }}>
                ↓ 6 points from previous check-in (Improving)
              </div>
            </div>

            {/* Mockup Question */}
            <div style={{ backgroundColor: "#1e1f22", border: "1px solid var(--hairline)", borderRadius: "var(--rounded-md)", padding: "14px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                &ldquo;How has your sleep quality been over the last 24 hours?&rdquo;
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                <div style={{ padding: "8px", backgroundColor: "#2b2d31", border: "1px solid var(--hairline)", borderRadius: "var(--rounded-sm)", fontSize: "12px", fontWeight: 600, textAlign: "center", color: "#ffffff" }}>
                  Restful
                </div>
                <div style={{ padding: "8px", backgroundColor: "var(--primary)", color: "#ffffff", borderRadius: "var(--rounded-sm)", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>
                  Okay ✓
                </div>
                <div style={{ padding: "8px", backgroundColor: "#2b2d31", border: "1px solid var(--hairline)", borderRadius: "var(--rounded-sm)", fontSize: "12px", fontWeight: 600, textAlign: "center", color: "#ffffff" }}>
                  Disrupted
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MULTI-PANEL ROLE PREVIEWS */}
        <section style={{ padding: "32px 0 48px 0" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 32px auto" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Multi-Panel Trauma Care System
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Built specifically for users, clinical practitioners, and platform administrators.
            </p>

            {/* Role Tabs */}
            <div className="nav-pill-group" style={{ marginTop: "16px", backgroundColor: "#1e1f22", padding: "4px" }}>
              <button
                onClick={() => setActiveTab("survivor")}
                className={`nav-pill-item ${activeTab === "survivor" ? "active" : ""}`}
                style={{ cursor: "pointer", fontSize: "12.5px" }}
              >
                👤 User Dashboard
              </button>
              <button
                onClick={() => setActiveTab("doctor")}
                className={`nav-pill-item ${activeTab === "doctor" ? "active" : ""}`}
                style={{ cursor: "pointer", fontSize: "12.5px" }}
              >
                🩺 Doctor Triage
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`nav-pill-item ${activeTab === "admin" ? "active" : ""}`}
                style={{ cursor: "pointer", fontSize: "12.5px" }}
              >
                🛡️ Admin Control
              </button>
            </div>
          </div>

          {/* Active Tab Card */}
          <div className="card" style={{ padding: "28px", backgroundColor: "#2b2d31" }}>
            {activeTab === "survivor" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "center" }}>
                <div>
                  <div style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                    USER DASHBOARD VIEW
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginBottom: "10px" }}>
                    Unscrollable Single-Screen Dashboard
                  </h3>
                  <p style={{ color: "#dbdee1", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                    Monitor your daily Dhriti Index, track check-ins on an interactive calendar, view historical trends, and chat with DhritiAi — all in a clean, non-overwhelming viewport.
                  </p>
                  <Link href="/login" className="btn btn-primary btn-sm">
                    <User size={14} /> Try User View
                  </Link>
                </div>
                <div style={{ backgroundColor: "#1e1f22", border: "1px solid var(--hairline)", borderRadius: "var(--rounded-lg)", padding: "18px", textAlign: "center" }}>
                  <Activity size={32} color="var(--primary)" style={{ margin: "0 auto 10px auto" }} />
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>0–100 Deterministic Index</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Calculated securely by backend scoring logic</div>
                </div>
              </div>
            )}

            {activeTab === "doctor" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "center" }}>
                <div>
                  <div style={{ color: "var(--status-stable)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                    DOCTOR TRIAGE QUEUE
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginBottom: "10px" }}>
                    High-Risk Queue & Crisis Interventions
                  </h3>
                  <p style={{ color: "#dbdee1", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                    Registered doctors can review distress cases, monitor sudden score drops, inspect qualitative reflections, and record clinical triage notes.
                  </p>
                  <Link href="/login" className="btn btn-secondary btn-sm">
                    <Stethoscope size={14} /> Try Doctor Triage
                  </Link>
                </div>
                <div style={{ backgroundColor: "#1e1f22", border: "1px solid var(--hairline)", borderRadius: "var(--rounded-lg)", padding: "18px", textAlign: "center" }}>
                  <ShieldAlert size={32} color="var(--status-critical)" style={{ margin: "0 auto 10px auto" }} />
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>Safety Concern Overrides</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Immediate flags for acute distress & hotline connections</div>
                </div>
              </div>
            )}

            {activeTab === "admin" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "center" }}>
                <div>
                  <div style={{ color: "var(--status-elevated)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                    PLATFORM COMMAND CENTER
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginBottom: "10px" }}>
                    RBAC User & System Management
                  </h3>
                  <p style={{ color: "#dbdee1", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                    System administrators manage user roles (User, Doctor, Admin), inspect platform audit logs, and oversee distress monitoring workflows.
                  </p>
                  <Link href="/login" className="btn btn-secondary btn-sm">
                    <LayoutDashboard size={14} /> Try Admin View
                  </Link>
                </div>
                <div style={{ backgroundColor: "#1e1f22", border: "1px solid var(--hairline)", borderRadius: "var(--rounded-lg)", padding: "18px", textAlign: "center" }}>
                  <ShieldCheck size={32} color="var(--status-elevated)" style={{ margin: "0 auto 10px auto" }} />
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>Audit & Role Control</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Manage account permissions and safety audit logs</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. VERIFIED 24/7 HELPLINES BANNER STRIP */}
        <section className="card" style={{ padding: "24px", backgroundColor: "rgba(245, 36, 67, 0.14)", border: "1px solid rgba(245, 36, 67, 0.4)", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                24/7 CRISIS RESPONSE (INDIA)
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
                Tele-MANAS: <a href="tel:14416" style={{ color: "#ffffff", textDecoration: "underline" }}>14416</a> (Toll-Free) &bull; KIRAN: <a href="tel:18005990019" style={{ color: "#ffffff", textDecoration: "underline" }}>1800-599-0019</a>
              </h3>
              <p style={{ fontSize: "13px", color: "#dbdee1" }}>
                Free, confidential, round-the-clock trained psychological support available in 20+ Indian languages.
              </p>
            </div>
            <Link href="/support" className="btn btn-danger btn-sm" style={{ padding: "8px 16px", fontSize: "13px" }}>
              <HeartPulse size={15} /> All Verified Resources
            </Link>
          </div>
        </section>

        <DisclaimerBanner />
      </div>
    </div>
  );
}
