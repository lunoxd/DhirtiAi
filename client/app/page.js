"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import DisclaimerBanner from "../components/DisclaimerBanner";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      {/* Hero Section */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "48px",
        alignItems: "center",
        padding: "48px 0 64px 0"
      }}>
        {/* Left Headline Column */}
        <div>
          <div className="nav-pill-group" style={{ marginBottom: "20px" }}>
            <span className="badge" style={{ backgroundColor: "var(--primary)", color: "#ffffff", padding: "2px 8px" }}>
              New
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", paddingRight: "8px" }}>
              AI-Assisted Early Distress Monitoring
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 5.5vw, 54px)",
            fontWeight: 800,
            lineHeight: 1.08,
            color: "var(--ink)",
            letterSpacing: "-0.03em",
            marginBottom: "20px"
          }}>
            Understand your wellbeing.<br />
            Recognize changes early.
          </h1>

          <p style={{
            fontSize: "17px",
            color: "var(--text-muted)",
            lineHeight: "1.6",
            marginBottom: "32px",
            fontWeight: 400
          }}>
            A calm, accessible platform for survivors and individuals in acute distress. Track changes over time with a deterministic 0–100 Dhriti Index and verified 24/7 human crisis support.
          </p>

          {/* Action Row */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href={isAuthenticated ? "/check-in" : "/register"}
              className="btn btn-primary btn-lg"
              style={{ minWidth: "180px" }}
            >
              <span>Start Check-in</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="btn btn-secondary btn-lg"
            >
              Live Demo Access
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "24px", fontSize: "13px", color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={15} color="var(--status-stable)" /> 100% Free & Private
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={15} color="var(--status-stable)" /> Non-Diagnostic
            </span>
          </div>
        </div>

        {/* Right Product Preview Card */}
        <div style={{
          backgroundColor: "var(--surface-soft)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--rounded-xl)",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-stable)" }} />
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                Live Wellbeing Preview
              </span>
            </div>
            <span className="badge badge-mild">Dhriti Index 24</span>
          </div>

          {/* Embedded UI Fragment */}
          <div className="card-inner" style={{ marginBottom: "16px", textAlign: "center", padding: "20px", backgroundColor: "#ffffff" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>CURRENT STATE</div>
            <div style={{ fontSize: "44px", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.03em", margin: "4px 0" }}>
              24<span style={{ fontSize: "18px", color: "var(--text-muted)" }}>/100</span>
            </div>
            <div style={{ fontSize: "13px", color: "var(--status-stable)", fontWeight: 700 }}>
              ↓ 6 points from previous check-in (Improving)
            </div>
          </div>

          {/* Stepped Button Question Mockup */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
              &ldquo;How has your sleep been recently?&rdquo;
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <div style={{ padding: "8px 12px", backgroundColor: "#ffffff", border: "1px solid var(--hairline)", borderRadius: "var(--rounded-md)", fontSize: "12px", fontWeight: 600, textAlign: "center", color: "var(--text-muted)" }}>
                Good
              </div>
              <div style={{ padding: "8px 12px", backgroundColor: "var(--primary)", color: "#ffffff", borderRadius: "var(--rounded-md)", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>
                Okay ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Feature Cards Section */}
      <section style={{ padding: "48px 0" }}>
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "8px" }}>
            How Dhriti Works
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            A calm, step-by-step approach to self-awareness and timely care.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {/* Card 1 */}
          <div className="card">
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--primary)",
              letterSpacing: "0.06em",
              marginBottom: "16px"
            }}>
              01 — CHECK IN
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
              Answer Simple Questions
            </h3>
            <p style={{ color: "var(--text-body)", fontSize: "14px", lineHeight: "1.6" }}>
              Complete a 2-minute check-in with straightforward button selections and optional reflections. No forced trauma disclosure.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--primary)",
              letterSpacing: "0.06em",
              marginBottom: "16px"
            }}>
              02 — UNDERSTAND
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
              Detect Changes Over Time
            </h3>
            <p style={{ color: "var(--text-body)", fontSize: "14px", lineHeight: "1.6" }}>
              Our deterministic scoring engine computes your 0–100 Dhriti Index, comparing it with previous check-ins to track trends.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--primary)",
              letterSpacing: "0.06em",
              marginBottom: "16px"
            }}>
              03 — CONNECT
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
              Find Appropriate Support
            </h3>
            <p style={{ color: "var(--text-body)", fontSize: "14px", lineHeight: "1.6" }}>
              Receive tailored grounding exercises, counseling recommendations, or immediate 24/7 human crisis connections.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="card" style={{ margin: "24px 0 48px 0", padding: "36px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--ink)", marginBottom: "24px" }}>
          Built for Safety, Dignity & Transparency
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "28px"
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)", marginBottom: "6px" }}>
              Deterministic Scoring Engine
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.5" }}>
              The numerical score is calculated directly by verifiable backend logic, ensuring consistent and auditable assessments.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)", marginBottom: "6px" }}>
              Immediate Safety Overrides
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.5" }}>
              If you signal an inability to stay safe, the system immediately presents direct 24/7 Indian crisis hotlines without score gating.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)", marginBottom: "6px" }}>
              Full Data Ownership & Privacy
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.5" }}>
              Your responses remain private to your account. You can permanently wipe your entire history at any time.
            </p>
          </div>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  );
}
