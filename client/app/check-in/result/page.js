"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiCheckIns } from "../../../lib/api";
import DhritiIndexGauge from "../../../components/DhritiIndexGauge";
import DisclaimerBanner from "../../../components/DisclaimerBanner";
import BreathingWidget from "../../../components/BreathingWidget";
import EmergencyModal from "../../../components/EmergencyModal";
import { CheckCircle2, ShieldAlert, HeartHandshake, Sparkles, LayoutDashboard, ArrowRight } from "lucide-react";

function ResultContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [checkIn, setCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEmergency, setShowEmergency] = useState(false);

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
      if (res.checkIn.safetyConcern || res.checkIn.riskLevel === "Critical") {
        setShowEmergency(true);
      }
    } catch (err) {
      console.error("Load Checkin Result Error:", err);
      setError(err.message || "Failed to load check-in result.");
    } finally {
      setLoading(false);
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
          <h2 style={{ color: "var(--ink)", marginBottom: "12px" }}>Check-in Not Found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>{error || "Could not retrieve the requested record."}</p>
          <Link href="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow" style={{ paddingTop: "24px", paddingBottom: "60px" }}>
      {/* Header Badge */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div className="badge badge-stable" style={{ marginBottom: "12px", fontSize: "13px", padding: "4px 12px" }}>
          <CheckCircle2 size={14} /> Check-in Completed
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Wellbeing Summary
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          Calculated deterministically based on your structured answers
        </p>
      </div>

      {/* Immediate Safety Alert if Flagged */}
      {checkIn.safetyConcern && (
        <div className="safety-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldAlert size={20} color="var(--error)" />
              <div>
                <strong style={{ color: "var(--ink)", fontSize: "15px" }}>24/7 Human Safety Support Available</strong>
                <p style={{ color: "var(--text-body)", fontSize: "13px" }}>Your responses indicate severe distress or safety concerns.</p>
              </div>
            </div>
            <button onClick={() => setShowEmergency(true)} className="btn btn-danger btn-sm">
              Connect to Helpline
            </button>
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
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <HeartHandshake size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
              Actionable Guidance
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.6" }}>
              {checkIn.supportRecommendation}
            </p>
          </div>
        </div>
      </div>

      {/* AI Qualitative Observations */}
      {checkIn.aiAnalysis && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Sparkles size={16} color="var(--primary)" />
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--ink)" }}>
              AI Reflection & Observations
            </h3>
          </div>

          <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.6", marginBottom: "16px" }}>
            {checkIn.aiAnalysis.summary}
          </p>

          {checkIn.aiAnalysis.observations && checkIn.aiAnalysis.observations.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {checkIn.aiAnalysis.observations.map((obs, idx) => (
                <div key={idx} className="card-inner" style={{ fontSize: "13px", color: "var(--text-body)" }}>
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
