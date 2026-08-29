"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiDhriti, apiCheckIns } from "../../lib/api";
import DhritiIndexGauge from "../../components/DhritiIndexGauge";
import CheckInCalendar from "../../components/CheckInCalendar";
import TrendChart from "../../components/TrendChart";
import DisclaimerBanner from "../../components/DisclaimerBanner";
import BreathingWidget from "../../components/BreathingWidget";
import { PlusCircle, ArrowRight, ShieldAlert, HeartHandshake, AlertCircle, MessageSquare, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [currentScore, setCurrentScore] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [allCheckIns, setAllCheckIns] = useState([]);
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
      setAllCheckIns(historyRes.checkIns || []);
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
      {/* Top Welcome Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
            Hello, {user?.name || "Friend"}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Welcome to your personal mental wellbeing overview.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/chat" className="btn btn-secondary btn-lg">
            <Sparkles size={16} color="var(--primary)" />
            <span>DhritiAi Assistant</span>
          </Link>
          <Link href="/check-in" className="btn btn-primary btn-lg">
            <PlusCircle size={16} />
            <span>Start Check-in</span>
          </Link>
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
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Safety Alert Flag */}
      {currentScore?.safetyConcern && (
        <div className="safety-banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 800, marginBottom: "4px" }}>
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

      {/* ROW 1: SCORE (LEFT) + CALENDAR (RIGHT) IN A ROW */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
        marginBottom: "24px"
      }}>
        <DhritiIndexGauge
          score={currentScore?.dhritiIndex || 0}
          riskLevel={currentScore?.riskLevel || "STABLE"}
          delta={currentScore?.deltaPoints || 0}
          trend={currentScore?.trend || "STABLE"}
          safetyConcern={currentScore?.safetyConcern}
        />

        <CheckInCalendar checkIns={allCheckIns} />
      </div>

      {/* ROW 2: TREND GRAPH & BOX BREATHING */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
        marginBottom: "24px"
      }}>
        <TrendChart trendPoints={trendData} />

        <BreathingWidget />
      </div>

      {/* Supportive Recommendation Card */}
      {hasData && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <HeartHandshake size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                Supportive Recommendation
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.5" }}>
                {currentScore.supportRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Check-ins List */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff" }}>RECENT CHECK-INS</h3>
          {allCheckIns.length > 0 && (
            <Link href="/history" style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {allCheckIns.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No recent records found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {allCheckIns.slice(0, 4).map((ci) => {
              const dateStr = new Date(ci.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              });
              return (
                <div
                  key={ci.id}
                  style={{
                    backgroundColor: "var(--surface-soft)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "var(--rounded-md)",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#ffffff" }}>{dateStr}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {ci.deltaPoints > 0 ? `↑ ${ci.deltaPoints} pts` : ci.deltaPoints < 0 ? `↓ ${Math.abs(ci.deltaPoints)} pts` : "Stable"}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>
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

      <DisclaimerBanner />
    </div>
  );
}
