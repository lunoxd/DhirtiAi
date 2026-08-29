"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiDhriti, apiCheckIns } from "../../lib/api";
import DhritiIndexGauge from "../../components/DhritiIndexGauge";
import TrendChart from "../../components/TrendChart";
import DisclaimerBanner from "../../components/DisclaimerBanner";
import BreathingWidget from "../../components/BreathingWidget";
import { PlusCircle, ArrowRight, ShieldAlert, HeartHandshake, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [currentScore, setCurrentScore] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [authLoading, isAuthenticated, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [currentRes, trendRes, historyRes] = await Promise.all([
        apiDhriti.getCurrent(),
        apiDhriti.getTrend(),
        apiCheckIns.getHistory()
      ]);

      setCurrentScore(currentRes);
      setTrendData(trendRes.trendPoints || []);
      setRecentCheckIns((historyRes.checkIns || []).slice(0, 4));
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && !currentScore)) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Loading your wellbeing dashboard...</p>
      </div>
    );
  }

  const hasData = currentScore && currentScore.hasCheckIns;

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Top Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", marginBottom: "4px" }}>
            Hello, {user?.name || "Friend"}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Welcome to your personal wellbeing overview.
          </p>
        </div>

        <Link href="/check-in" className="btn btn-primary btn-lg">
          <PlusCircle size={16} />
          <span>Start New Check-in</span>
        </Link>
      </div>

      {error && (
        <div style={{
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "var(--rounded-md)",
          padding: "12px 16px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--error)",
          fontSize: "14px"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Safety Alert if flagged */}
      {currentScore?.safetyConcern && (
        <div className="safety-banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ color: "var(--ink)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                We are here with you
              </h3>
              <p style={{ color: "var(--text-body)", fontSize: "13px" }}>
                Your recent check-in indicated safety or severe distress concerns. Trained professionals are available 24/7.
              </p>
            </div>
            <Link href="/support" className="btn btn-danger btn-sm">
              <ShieldAlert size={14} /> Immediate Helplines
            </Link>
          </div>
        </div>
      )}

      {!hasData ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 24px", marginBottom: "30px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "var(--rounded-full)",
            backgroundColor: "var(--surface-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            color: "var(--ink)"
          }}>
            <PlusCircle size={28} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            No Check-ins Recorded Yet
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "460px", margin: "0 auto 24px auto" }}>
            Take your first 2-minute mental wellbeing check-in to calculate your baseline Dhriti Index.
          </p>
          <Link href="/check-in" className="btn btn-primary btn-lg">
            Take First Check-in
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "24px"
        }}>
          <DhritiIndexGauge
            score={currentScore.dhritiIndex}
            riskLevel={currentScore.riskLevel}
            delta={currentScore.deltaPoints}
            trend={currentScore.trend}
            safetyConcern={currentScore.safetyConcern}
          />

          <TrendChart trendPoints={trendData} />
        </div>
      )}

      {/* Support Guidance Recommendation */}
      {hasData && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <HeartHandshake size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px", letterSpacing: "-0.01em" }}>
                Supportive Recommendation
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.5" }}>
                {currentScore.supportRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Check-ins & Grounding Widget */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px"
      }}>
        {/* Recent Check-ins */}
        <div className="card">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>RECENT CHECK-INS</h3>
            {recentCheckIns.length > 0 && (
              <Link href="/history" style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", textDecoration: "underline" }}>
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {recentCheckIns.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No recent records found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentCheckIns.map((ci) => {
                const dateStr = new Date(ci.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                });
                return (
                  <div
                    key={ci.id}
                    style={{
                      backgroundColor: "var(--surface-card)",
                      border: "1px solid var(--hairline-soft)",
                      borderRadius: "var(--rounded-md)",
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--ink)" }}>{dateStr}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {ci.deltaPoints > 0 ? `↑ ${ci.deltaPoints} pts` : ci.deltaPoints < 0 ? `↓ ${Math.abs(ci.deltaPoints)} pts` : "Stable"}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em" }}>
                        {Math.round(ci.dhritiIndex)}
                      </span>
                      <span className={`badge badge-${ci.riskLevel.toLowerCase()}`}>
                        {ci.riskLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Breathing Widget */}
        <BreathingWidget />
      </div>

      <div style={{ marginTop: "24px" }}>
        <DisclaimerBanner />
      </div>
    </div>
  );
}
