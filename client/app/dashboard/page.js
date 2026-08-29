"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiDhriti, apiCheckIns } from "../../lib/api";
import DhritiIndexGauge from "../../components/DhritiIndexGauge";
import CheckInCalendar from "../../components/CheckInCalendar";
import TrendChart from "../../components/TrendChart";
import BreathingWidget from "../../components/BreathingWidget";
import { PlusCircle, ShieldAlert, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

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
      <div style={{ width: "100%", height: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Loading full-width dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      height: "calc(100vh - 84px)",
      maxHeight: "calc(100vh - 84px)",
      overflow: "hidden",
      padding: "0 24px 16px 24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      {/* 1. Header Control Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        marginBottom: "12px"
      }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "2px" }}>
            Welcome, {user?.name || "Friend"}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Full-screen personal wellbeing monitoring dashboard
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link href="/chat" className="btn btn-secondary btn-sm">
            <Sparkles size={15} color="var(--primary)" />
            <span>DhritiAi Page</span>
          </Link>
          <Link href="/check-in" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>New Check-in</span>
          </Link>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: "rgba(245, 36, 67, 0.18)",
          border: "1px solid var(--status-critical)",
          borderRadius: "var(--rounded-md)",
          padding: "8px 12px",
          marginBottom: "10px",
          color: "var(--status-critical)",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Safety Alert Flag */}
      {currentScore?.safetyConcern && (
        <div className="safety-banner" style={{ padding: "12px 16px", marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700 }}>
              ⚠️ Severe distress flagged. 24/7 human crisis counselors are available.
            </span>
            <Link href="/support" className="btn btn-danger btn-sm" style={{ padding: "4px 10px", fontSize: "12px" }}>
              <ShieldAlert size={13} /> 24/7 Helplines
            </Link>
          </div>
        </div>
      )}

      {/* 2. Main Full-Width Grid Row: 3 Panels Across Screen */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr 1fr",
        gap: "16px",
        flex: 1,
        maxHeight: "calc(100vh - 210px)",
        alignItems: "stretch"
      }}>
        {/* Column 1: Big Score Display Gauge */}
        <div style={{ height: "100%" }}>
          <DhritiIndexGauge
            score={currentScore?.dhritiIndex || 0}
            riskLevel={currentScore?.riskLevel || "STABLE"}
            delta={currentScore?.deltaPoints || 0}
            trend={currentScore?.trend || "STABLE"}
            safetyConcern={currentScore?.safetyConcern}
          />
        </div>

        {/* Column 2: Check-in Monthly Calendar Grid */}
        <div style={{ height: "100%" }}>
          <CheckInCalendar checkIns={allCheckIns} />
        </div>

        {/* Column 3: Box Breathing & Trend Graph */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
          <BreathingWidget />
          <div style={{ flex: 1 }}>
            <TrendChart trendPoints={trendData} />
          </div>
        </div>
      </div>

      {/* 3. Bottom Control Row */}
      <div className="card" style={{ padding: "10px 16px", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>RECENT RECORD:</span>
          {allCheckIns.length > 0 ? (
            <span style={{ fontSize: "13px", color: "var(--text-body)" }}>
              {new Date(allCheckIns[0].createdAt).toLocaleDateString()} — Score: <strong>{Math.round(allCheckIns[0].dhritiIndex)}/100</strong> ({allCheckIns[0].riskLevel})
            </span>
          ) : (
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>No check-in history available.</span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/history" style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>Full History</span>
            <ArrowRight size={13} />
          </Link>
          <span style={{ color: "var(--hairline)" }}>|</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Non-Diagnostic Wellbeing Tool
          </span>
        </div>
      </div>
    </div>
  );
}
