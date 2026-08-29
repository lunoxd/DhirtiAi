"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiCheckIns } from "../../../lib/api";
import DhritiIndexGauge from "../../../components/DhritiIndexGauge";
import DisclaimerBanner from "../../../components/DisclaimerBanner";
import BreathingWidget from "../../../components/BreathingWidget";
import EmergencyModal from "../../../components/EmergencyModal";
import { CheckCircle2, ShieldAlert, HeartHandshake, Sparkles, LayoutDashboard, ArrowRight, Stethoscope, PhoneCall, Check } from "lucide-react";

function ResultContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [checkIn, setCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEmergency, setShowEmergency] = useState(false);

  const [requestingDoctor, setRequestingDoctor] = useState(false);
  const [doctorRequested, setDoctorRequested] = useState(false);

  useEffect(() => {
    if (id) {
      loadResult();
    }
  }, [id]);

  const loadResult = async () => {
    setLoading(true);
    try {
      const res = await apiCheckIns.getById(id);
      setCheckIn(res.checkIn);
      if (res.checkIn.safetyConcern || res.checkIn.riskLevel === "Critical" || res.checkIn.triageStatus === "PENDING_DOCTOR_CALLBACK") {
        setDoctorRequested(res.checkIn.triageStatus === "PENDING_DOCTOR_CALLBACK");
      }
    } catch (err) {
      console.error("Load Checkin Result Error:", err);
      setError(err.message || "Failed to load check-in result.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDoctor = async () => {
    if (!id) return;
    setRequestingDoctor(true);
    try {
      await apiCheckIns.requestDoctor(id);
      setDoctorRequested(true);
    } catch (err) {
      alert("Failed to send doctor callback request: " + err.message);
    } finally {
      setRequestingDoctor(false);
    }
  };

  if (loading) {
    return (
      <div className="container-narrow" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading check-in summary...</p>
      </div>
    );
  }

  if (error || !checkIn) {
    return (
      <div className="container-narrow" style={{ paddingTop: "60px", paddingBottom: "60px", textAlign: "center" }}>
        <div className="card" style={{ padding: "40px" }}>
          <h2 style={{ color: "#ffffff", marginBottom: "12px" }}>Check-in Not Found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>{error || "Could not retrieve the requested record."}</p>
          <Link href="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const isHighOrCritical = checkIn.dhritiIndex >= 50 || checkIn.riskLevel === "High" || checkIn.riskLevel === "Critical" || checkIn.safetyConcern;

  return (
    <div className="container-narrow" style={{ paddingTop: "24px", paddingBottom: "60px" }}>
      {/* Header Badge */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div className="badge badge-stable" style={{ marginBottom: "12px", fontSize: "13px", padding: "4px 12px" }}>
          <CheckCircle2 size={14} /> Check-in Completed
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
          Wellbeing Summary
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          Calculated deterministically based on your structured answers
        </p>
      </div>

      {/* DOCTOR CONSULTATION & CRISIS HELPLINES BOX (If Score is Elevated/High/Critical) */}
      {isHighOrCritical && (
        <div className="card" style={{ padding: "24px", backgroundColor: "rgba(245, 36, 67, 0.14)", border: "1px solid rgba(245, 36, 67, 0.5)", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
            <ShieldAlert size={26} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                DOCTOR TRIAGE & CRISIS ASSISTANCE REQUIRED
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
                High Distress Score ({Math.round(checkIn.dhritiIndex)}/100 - {checkIn.riskLevel})
              </h2>
              <p style={{ fontSize: "14px", color: "#dbdee1", lineHeight: "1.5" }}>
                Your responses indicate elevated emotional distress. Professional doctor consultation and 24/7 human crisis support are available immediately.
              </p>
            </div>
          </div>

          {/* Doctor Callback Request Button */}
          <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#1e1f22", borderRadius: "var(--rounded-lg)", border: "1px solid var(--hairline)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>
                  🩺 Request Clinical Doctor Triage Callback
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Transmits your case to the Doctor Triage Queue (`/doctor`) for clinician review.
                </div>
              </div>

              {doctorRequested ? (
                <div className="badge badge-stable" style={{ fontSize: "13px", padding: "8px 14px", gap: "6px" }}>
                  <Check size={16} /> Callback Transmitted to Doctor Queue
                </div>
              ) : (
                <button
                  onClick={handleRequestDoctor}
                  disabled={requestingDoctor}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: "13px", padding: "10px 18px", boxShadow: "0 4px 16px rgba(245, 36, 67, 0.4)" }}
                >
                  <Stethoscope size={16} />
                  <span>{requestingDoctor ? "Transmitting..." : "Request Doctor Callback"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Verified Crisis Helpline Contacts */}
          <div style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>
            📞 VERIFIED 24/7 INDIAN CRISIS CONTACTS:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            <a href="tel:14416" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: "#1e1f22", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)", color: "#ffffff", textDecoration: "none" }}>
              <PhoneCall size={18} color="var(--status-stable)" />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>Tele-MANAS: 14416</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>24/7 Toll-Free Helpline</div>
              </div>
            </a>

            <a href="tel:18005990019" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: "#1e1f22", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)", color: "#ffffff", textDecoration: "none" }}>
              <PhoneCall size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>KIRAN: 1800-599-0019</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Govt Mental Health Line</div>
              </div>
            </a>

            <a href="tel:+919999666555" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: "#1e1f22", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)", color: "#ffffff", textDecoration: "none" }}>
              <PhoneCall size={18} color="var(--status-elevated)" />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>Vandrevala: +91 9999 666 555</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>24/7 Crisis Support</div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Main Score Gauge */}
      <div style={{ marginBottom: "24px" }}>
        <DhritiIndexGauge
          score={checkIn.dhritiIndex}
          riskLevel={checkIn.riskLevel}
          delta={checkIn.deltaPoints}
          trend={checkIn.trend}
          safetyConcern={checkIn.safetyConcern}
        />
      </div>

      {/* Support Recommendation */}
      <div className="card" style={{ marginBottom: "20px", backgroundColor: "#2b2d31" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <HeartHandshake size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              Actionable Guidance
            </h3>
            <p style={{ fontSize: "14px", color: "#dbdee1", lineHeight: "1.6" }}>
              {checkIn.supportRecommendation}
            </p>
          </div>
        </div>
      </div>

      {/* AI Qualitative Observations */}
      {checkIn.aiAnalysis && (
        <div className="card" style={{ marginBottom: "20px", backgroundColor: "#2b2d31" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Sparkles size={16} color="var(--primary)" />
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff" }}>
              AI Reflection & Observations
            </h3>
          </div>

          <p style={{ fontSize: "14px", color: "#dbdee1", lineHeight: "1.6", marginBottom: "16px" }}>
            {checkIn.aiAnalysis.summary}
          </p>

          {checkIn.aiAnalysis.observations && checkIn.aiAnalysis.observations.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {checkIn.aiAnalysis.observations.map((obs, idx) => (
                <div key={idx} style={{ fontSize: "13px", color: "#dbdee1", backgroundColor: "#1e1f22", padding: "8px 12px", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)" }}>
                  • {obs}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Breathing Grounding Tool */}
      <div style={{ marginBottom: "24px" }}>
        <BreathingWidget />
      </div>

      {/* Bottom Actions */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Link href="/dashboard" className="btn btn-primary btn-lg">
          <LayoutDashboard size={16} /> Go to Dashboard
        </Link>
        <Link href="/support" className="btn btn-secondary btn-lg">
          View All Helplines <ArrowRight size={16} />
        </Link>
      </div>

      <div style={{ marginTop: "32px" }}>
        <DisclaimerBanner />
      </div>

      {showEmergency && (
        <EmergencyModal onClose={() => setShowEmergency(false)} isCritical={true} />
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="container-narrow" style={{ padding: "60px 0", textAlign: "center", color: "var(--text-muted)" }}>Loading result...</div>}>
      <ResultContent />
    </Suspense>
  );
}
