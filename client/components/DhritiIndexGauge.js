"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

export default function DhritiIndexGauge({ score, riskLevel, delta = 0, trend = "STABLE", safetyConcern = false }) {
  const numScore = typeof score === "number" ? Math.round(score) : (score ? parseInt(score) : 0);

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case "critical": return "var(--status-critical)";
      case "high": return "var(--status-high)";
      case "elevated": return "var(--status-elevated)";
      case "mild": return "var(--status-mild)";
      case "stable":
      default: return "var(--status-stable)";
    }
  };

  const getBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case "critical": return "badge-critical";
      case "high": return "badge-high";
      case "elevated": return "badge-elevated";
      case "mild": return "badge-mild";
      case "stable":
      default: return "badge-stable";
    }
  };

  const riskColor = getRiskColor(riskLevel);

  return (
    <div className="card" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
      {safetyConcern && (
        <div style={{
          backgroundColor: "rgba(245, 36, 67, 0.18)",
          borderBottom: "1px solid rgba(245, 36, 67, 0.45)",
          padding: "8px 12px",
          margin: "-24px -24px 20px -24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "var(--status-critical)",
          fontSize: "12px",
          fontWeight: 700
        }}>
          <AlertTriangle size={14} />
          <span>IMMEDIATE SAFETY SUPPORT RECOMMENDED</span>
        </div>
      )}

      <div style={{
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        marginBottom: "8px"
      }}>
        DHRITI INDEX
      </div>

      {/* Score Number */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: "6px",
        margin: "8px 0 16px 0"
      }}>
        <span style={{
          fontSize: "56px",
          fontWeight: 800,
          lineHeight: 1,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          fontVariantNumeric: "tabular-nums"
        }}>
          {numScore}
        </span>
        <span style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "var(--text-muted)"
        }}>
          / 100
        </span>
      </div>

      {/* Risk Badge */}
      <div style={{ marginBottom: "18px" }}>
        <span className={`badge ${getBadgeClass(riskLevel)}`} style={{ fontSize: "13px", padding: "4px 14px" }}>
          {riskLevel || "STABLE"}
        </span>
      </div>

      {/* Progress Track */}
      <div style={{
        width: "100%",
        height: "8px",
        backgroundColor: "var(--surface-soft)",
        borderRadius: "var(--rounded-pill)",
        overflow: "hidden",
        marginBottom: "16px"
      }}>
        <div style={{
          height: "100%",
          width: `${Math.min(100, Math.max(0, numScore))}%`,
          backgroundColor: riskColor,
          borderRadius: "var(--rounded-pill)",
          transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        }} />
      </div>

      {/* Delta Comparison */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        fontSize: "13px",
        color: "var(--text-muted)"
      }}>
        {delta > 0 ? (
          <>
            <TrendingUp size={16} color="var(--status-critical)" />
            <span><strong style={{ color: "#ffffff" }}>↑ {Math.abs(delta)} points</strong> from previous check-in</span>
          </>
        ) : delta < 0 ? (
          <>
            <TrendingDown size={16} color="var(--status-stable)" />
            <span><strong style={{ color: "#ffffff" }}>↓ {Math.abs(delta)} points</strong> from previous check-in</span>
          </>
        ) : (
          <>
            <Minus size={16} color="var(--text-muted)" />
            <span>Stable compared to last check-in</span>
          </>
        )}
      </div>
    </div>
  );
}
