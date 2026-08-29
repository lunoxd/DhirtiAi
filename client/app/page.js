"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, ShieldCheck, HeartHandshake, Activity, Sparkles, CheckCircle2 } from "lucide-react";
import DisclaimerBanner from "../components/DisclaimerBanner";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      {/* Hero Section */}
      <section style={{
        textAlign: "center",
        maxWidth: "760px",
        margin: "40px auto 60px auto"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--brand-primary)",
          marginBottom: "24px"
        }}>
          <Sparkles size={14} />
          <span>AI-Assisted Early Distress Monitoring</span>
        </div>

        <h1 style={{
          fontSize: "clamp(34px, 6vw, 54px)",
          fontWeight: 900,
          lineHeight: 1.15,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          marginBottom: "20px"
        }}>
          DHRITI
        </h1>

        <p style={{
          fontSize: "clamp(18px, 3vw, 22px)",
          color: "var(--text-normal)",
          lineHeight: "1.5",
          marginBottom: "32px",
          fontWeight: 400
        }}>
          Understand your wellbeing.<br />
          Recognize changes early.<br />
          Find support when it matters.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
          <Link
            href={isAuthenticated ? "/check-in" : "/login"}
            className="btn btn-primary btn-lg"
            style={{ minWidth: "190px" }}
          >
            <span>Start Check-in</span>
            <ArrowRight size={18} />
          </Link>
          <a
            href="#how-it-works"
            className="btn btn-secondary btn-lg"
            style={{ minWidth: "150px" }}
          >
            Learn More
          </a>
        </div>

        <div style={{ marginTop: "32px" }}>
          <DisclaimerBanner />
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section id="how-it-works" style={{ marginBottom: "60px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
            How DHRITI Works
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            A calm, step-by-step approach to self-awareness and timely care.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {/* Step 1 */}
          <div className="card">
            <div style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "var(--brand-primary)",
              letterSpacing: "0.08em",
              marginBottom: "12px"
            }}>
              01 — CHECK IN
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
              Answer Simple Questions
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              Complete a 2-minute check-in with straightforward button selections and optional reflections. No forced trauma disclosure.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card">
            <div style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "var(--brand-primary)",
              letterSpacing: "0.08em",
              marginBottom: "12px"
            }}>
              02 — UNDERSTAND
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
              Detect Changes Over Time
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              Our deterministic scoring engine computes your 0–100 Dhriti Index, comparing it with previous check-ins to track trends.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card">
            <div style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "var(--brand-primary)",
              letterSpacing: "0.08em",
              marginBottom: "12px"
            }}>
              03 — CONNECT
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
              Find Appropriate Support
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              Receive tailored grounding exercises, counseling recommendations, or immediate 24/7 human crisis connections.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="card" style={{ marginBottom: "60px", padding: "36px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginBottom: "20px", textAlign: "center" }}>
          Built for Safety, Privacy & Dignity
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px"
        }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <CheckCircle2 size={20} color="var(--status-stable)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#ffffff", marginBottom: "4px" }}>
                Deterministic Scoring
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                The numerical score is calculated directly by verifiable backend logic, ensuring consistent and predictable assessments.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <CheckCircle2 size={20} color="var(--status-stable)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#ffffff", marginBottom: "4px" }}>
                Immediate Safety Overrides
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                If you signal an inability to stay safe, the system immediately presents direct crisis hotlines without score gating.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <CheckCircle2 size={20} color="var(--status-stable)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#ffffff", marginBottom: "4px" }}>
                Full Data Ownership
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Your responses remain private to your account. You can permanently wipe your entire history at any time.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}>
          Ready for your check-in?
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
          It takes less than two minutes and helps you keep track of your mental peace.
        </p>
        <Link href={isAuthenticated ? "/check-in" : "/register"} className="btn btn-primary btn-lg">
          Begin Check-in Now
        </Link>
      </section>
    </div>
  );
}
