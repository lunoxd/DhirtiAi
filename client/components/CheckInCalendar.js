"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

export default function CheckInCalendar({ checkIns = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayCheckIns, setSelectedDayCheckIns] = useState(null);

  // Map check-ins by ISO date string (YYYY-MM-DD)
  const checkInsByDate = {};
  checkIns.forEach((ci) => {
    const d = new Date(ci.createdAt);
    const key = d.toISOString().split("T")[0];
    if (!checkInsByDate[key]) checkInsByDate[key] = [];
    checkInsByDate[key].push(ci);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Days calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "critical":
      case "high": return "var(--primary)";
      case "elevated": return "var(--status-elevated)";
      case "mild":
      case "stable":
      default: return "var(--status-stable)";
    }
  };

  // Build grid days
  const gridCells = [];

  // Padding days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      dateKey: null
    });
  }

  // Days in current month
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    gridCells.push({
      day,
      isCurrentMonth: true,
      dateKey,
      checkIns: checkInsByDate[dateKey] || []
    });
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="card" style={{ padding: "20px" }}>
      {/* Header Month Switcher */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarIcon size={16} color="var(--primary)" />
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--ink)" }}>
            {monthNames[month]} {year}
          </h3>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={handlePrevMonth}
            className="btn btn-secondary btn-sm"
            style={{ padding: "4px 8px" }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="btn btn-secondary btn-sm"
            style={{ padding: "4px 8px" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        textAlign: "center",
        fontSize: "11px",
        fontWeight: 700,
        color: "var(--text-muted)",
        marginBottom: "8px"
      }}>
        <div>SUN</div>
        <div>MON</div>
        <div>TUE</div>
        <div>WED</div>
        <div>THU</div>
        <div>FRI</div>
        <div>SAT</div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px"
      }}>
        {gridCells.map((cell, idx) => {
          const hasCheckIns = cell.isCurrentMonth && cell.checkIns && cell.checkIns.length > 0;
          const isToday = cell.dateKey === todayStr;
          const topCheckIn = hasCheckIns ? cell.checkIns[0] : null;

          return (
            <div
              key={idx}
              onClick={() => hasCheckIns && setSelectedDayCheckIns(cell.checkIns)}
              style={{
                height: "42px",
                borderRadius: "var(--rounded-md)",
                backgroundColor: hasCheckIns
                  ? "rgba(245, 36, 67, 0.08)"
                  : cell.isCurrentMonth
                  ? "var(--surface-soft)"
                  : "transparent",
                border: isToday
                  ? "2px solid var(--primary)"
                  : "1px solid var(--hairline)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: hasCheckIns ? "pointer" : "default",
                opacity: cell.isCurrentMonth ? 1 : 0.3,
                position: "relative"
              }}
            >
              <span style={{
                fontSize: "12px",
                fontWeight: isToday || hasCheckIns ? 800 : 500,
                color: hasCheckIns ? "var(--ink)" : "var(--text-body)"
              }}>
                {cell.day}
              </span>

              {/* Score Indicator Pill / Dot */}
              {hasCheckIns && topCheckIn && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#ffffff",
                  backgroundColor: getRiskColor(topCheckIn.riskLevel),
                  borderRadius: "var(--rounded-pill)",
                  padding: "1px 4px",
                  lineHeight: 1,
                  marginTop: "2px"
                }}>
                  {Math.round(topCheckIn.dhritiIndex)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Check-in Popup */}
      {selectedDayCheckIns && selectedDayCheckIns.length > 0 && (
        <div style={{
          marginTop: "14px",
          backgroundColor: "var(--surface-soft)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--rounded-md)",
          padding: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)" }}>
              Check-in on {new Date(selectedDayCheckIns[0].createdAt).toLocaleDateString()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Score: <strong style={{ color: "var(--ink)" }}>{Math.round(selectedDayCheckIns[0].dhritiIndex)}/100</strong> ({selectedDayCheckIns[0].riskLevel})
            </div>
          </div>
          <button
            onClick={() => setSelectedDayCheckIns(null)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "11px", padding: "2px 8px" }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
