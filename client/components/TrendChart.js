"use client";

import React from "react";

export default function TrendChart({ trendPoints = [] }) {
  if (!trendPoints || trendPoints.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Complete a few check-ins to unlock your wellbeing trend timeline.
        </p>
      </div>
    );
  }

  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 40, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = trendPoints.slice(-10);
  const numPoints = points.length;

  const getX = (idx) => {
    if (numPoints <= 1) return padding.left + chartWidth / 2;
    return padding.left + (idx / (numPoints - 1)) * chartWidth;
  };

  const getY = (score) => {
    const clamped = Math.min(100, Math.max(0, score));
    return padding.top + chartHeight - (clamped / 100) * chartHeight;
  };

  const polylinePoints = points.map((p, idx) => `${getX(idx)},${getY(p.score)}`).join(" ");

  const getPointColor = (score) => {
    if (score >= 85) return "var(--status-critical)";
    if (score >= 70) return "var(--status-high)";
    if (score >= 50) return "var(--status-elevated)";
    if (score >= 25) return "var(--status-mild)";
    return "var(--status-stable)";
  };

  return (
    <div className="card">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px"
      }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>DHRITI TREND</h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Wellbeing score progression over time</p>
        </div>
        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-stable)" }} /> Stable
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-elevated)" }} /> Elevated
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-critical)" }} /> Critical
          </span>
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", display: "block", minWidth: "320px" }}
        >
          {/* Horizontal Grid lines */}
          {[0, 25, 50, 75, 100].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="var(--hairline)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  fill="var(--text-muted)"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="inherit"
                >
                  {level}
                </text>
              </g>
            );
          })}

          {/* Connected Trend Line */}
          {numPoints > 1 && (
            <polyline
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
          )}

          {/* Data Points */}
          {points.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.score);
            const dateStr = p.date ? new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : `Check-in ${idx + 1}`;
            const color = getPointColor(p.score);

            return (
              <g key={p.id || idx}>
                {/* Circle Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="5.5"
                  fill="#2b2d31"
                  stroke={color}
                  strokeWidth="2.5"
                />

                {/* Score label above point */}
                <text
                  x={cx}
                  y={cy - 10}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  {Math.round(p.score)}
                </text>

                {/* Date label at bottom */}
                <text
                  x={cx}
                  y={height - padding.bottom + 18}
                  fill="var(--text-muted)"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  {dateStr}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
