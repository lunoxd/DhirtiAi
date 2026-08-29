"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { apiCheckIns } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import DhritiIndexGauge from "../../../components/DhritiIndexGauge";
import DisclaimerBanner from "../../../components/DisclaimerBanner";
import EmergencyModal from "../../../components/EmergencyModal";
import { CheckCircle2, ShieldAlert, HeartHandshake, ArrowRight, Sparkles, Phone } from "lucide-react";

function CheckInResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkInId = searchParams.get("id");
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [checkIn, setCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (checkInId) {
      loadCheckIn(checkInId);
    } else {
      loadLatestCheckIn();
    }
  }, [checkInId, authLoading, isAuthenticated, router]);

  const loadCheckIn = async (id) => {
    setLoading(true);
    try {
      const res = await apiCheckIns.getById(id);
      setCheckIn(res.checkIn);
    } catch (err) {
      console.error("Failed to load check-in:", err);
      setError(err.message || "Failed to load check-in result.");
    } finally {
      setLoading(false);
    }
  };

  const loadLatestCheckIn = async () => {
    setLoading(true);
    try {
      const res = await apiCheckIns.getHistory();
      if (res.checkIns && res.checkIns.length > 0) {
        setCheckIn(res.checkIns[0]);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Failed to load result.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container-narrow" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Loading check-in result...</p>
      </div>
    );
  }

  if (error || !checkIn) {
    return (
      <div className="container-narrow" style={{ textAlign: "center", padding: "60px 20px" }}>
        <p style={{ color: "var(--error)", marginBottom: "16px" }}>{error || "Check-in not found."}</p>
        <Link href="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
      </div>
    );
  }

  const aiObs = checkIn.aiAnalysis?.distressIndicators || [];
  const noticedList = aiObs.length > 0
    ? aiObs
    : ["General distress score recorded", "Responses saved to your private timeline"];

  const whatMayHelp = checkIn.supportRecommendation || "Speaking with someone you trust or a qualified counselor may be helpful.";

  return (
    <div className="container-narrow" style={{ paddingTop: "20px", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "rgba(35, 165, 90, 0.18)",
          color: "var(--status-stable)",
          padding: "4px 14px",
          borderRadius: "var(--rounded-pill)",
          fontSize: "13px",
          fontWeight: 700,
          marginBottom: "12px"
        }}>
          <CheckCircle2 size={16} />
          <span>Check-in Complete</span>
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
          Your Wellbeing Summary
        </h1>
      </div>

      {/* Immediate Crisis Alert if triggered */}
      {checkIn.safetyConcern && (
        <div className="safety-banner" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
            <ShieldAlert size={24} color="var(--error)" style={{ flexShrink: 0 }} />
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
                We&apos;re here with you.
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.5" }}>
                Your responses suggest that you may need immediate support. You do not have to carry this alone.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="btn btn-danger"
              style={{ fontWeight: 700 }}
            >
              <Phone size={16} /> Call Emergency Support
            </button>
            <Link href="/support" className="btn btn-secondary">
              Talk to a Professional
            </Link>
          </div>
        </div>
      )}

      {/* Main Dhriti Index Score Card */}
      <div style={{ marginBottom: "20px" }}>
        <DhritiIndexGauge
          score={checkIn.dhritiIndex}
          riskLevel={checkIn.riskLevel}
          delta={checkIn.deltaPoints}
          trend={checkIn.trend}
          safetyConcern={checkIn.safetyConcern}
        />
      </div>

      {/* What We Noticed Section */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--primary)",
          marginBottom: "14px"
        }}>
          <Sparkles size={16} />
          <span>WHAT WE NOTICED</span>
        </div>

        <ul style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {noticedList.map((item, idx) => (
            <li key={idx} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontSize: "14px",
              color: "var(--text-body)"
            }}>
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {checkIn.aiAnalysis?.summary && (
          <div style={{
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid var(--hairline)",
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: "1.5"
          }}>
            <em>&ldquo;{checkIn.aiAnalysis.summary}&rdquo;</em>
          </div>
        )}
      </div>

      {/* What May Help Section */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--status-stable)",
          marginBottom: "12px"
        }}>
          <HeartHandshake size={16} />
          <span>WHAT MAY HELP</span>
        </div>

        <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.6" }}>
          {whatMayHelp}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link href="/support" className="btn btn-secondary">
          <HeartHandshake size={16} />
          <span>Find Support Resources</span>
        </Link>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/history" className="btn btn-secondary">
            <span>View My Progress</span>
          </Link>
          <Link href="/dashboard" className="btn btn-primary">
            <span>Done</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <DisclaimerBanner />
      </div>

      {showEmergencyModal && (
        <EmergencyModal
          isCritical={true}
          onClose={() => setShowEmergencyModal(false)}
        />
      )}
    </div>
  );
}

export default function CheckInResultPage() {
  return (
    <Suspense fallback={
      <div className="container-narrow" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading results...</p>
      </div>
    }>
      <CheckInResultContent />
    </Suspense>
  );
}
