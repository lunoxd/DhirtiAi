"use client";

import React from "react";

export default function TrendChart({ trendPoints = [] }) {
  if (!trendPoints || trendPoints.length === 0) {
    return (
      <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", minHeight: "280px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
          WELLBEING TREND TIMELINE
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          Complete 2 or more check-ins to generate your trend graph.
        </p>
      </div>
    );
  }

  const height = 180;
  const width = 460;
  const padding = 36;

  const maxScore = 100;
  const minScore = 0;

  const pointsCount = trendPoints.length;
  const stepX = pointsCount > 1 ? (width - padding * 2) / (pointsCount - 1) : 0;

  const coords = trendPoints.map((pt, idx) => {
    const x = pointsCount === 1 ? width / 2 : padding + idx * stepX;
    const y = height - padding - (pt.score / (maxScore - minScore)) * (height - padding * 2);
    return { x, y, score: pt.score, date: pt.date, riskLevel: pt.riskLevel };
  });

  const polylineStr = coords.map((c) => `${c.x},${c.y}`).join(" ");

  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            HISTORICAL DHRITI TREND
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
            Score Progression Over Time
          </div>
        </div>
        <span className="badge badge-stable">0–100 Scale</span>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#3f4147" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#3f4147" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#3f4147" />

          {/* Grid Y Axis Labels */}
          <text x={padding - 8} y={padding + 4} fill="#949ba4" fontSize="10" fontWeight="600" textAnchor="end">100</text>
          <text x={padding - 8} y={height / 2 + 4} fill="#949ba4" fontSize="10" fontWeight="600" textAnchor="end">50</text>
          <text x={padding - 8} y={height - padding + 4} fill="#949ba4" fontSize="10" fontWeight="600" textAnchor="end">0</text>

          {/* Polyline */}
          {coords.length > 1 && (
            <polyline
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineStr}
            />
          )}

          {/* Data Points */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle
                cx={c.x}
                cy={c.y}
                r="5"
                fill="#2b2d31"
                stroke="var(--primary)"
                strokeWidth="3"
              />
              <text
                x={c.x}
                y={c.y - 10}
                fill="#ffffff"
                fontSize="11"
                fontWeight="800"
                textAnchor="middle"
              >
                {Math.round(c.score)}
              </text>
              <text
                x={c.x}
                y={height - padding + 16}
                fill="#949ba4"
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
              >
                {c.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
