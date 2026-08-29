"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Heart } from "lucide-react";

export default function BreathingWidget() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Inhale"); // "Inhale" | "Hold" | "Exhale" | "Pause"
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const phaseDurations = {
    Inhale: 4,
    Hold: 4,
    Exhale: 4,
    Pause: 4
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phase
          if (phase === "Inhale") {
            setPhase("Hold");
            return phaseDurations.Hold;
          } else if (phase === "Hold") {
            setPhase("Exhale");
            return phaseDurations.Exhale;
          } else if (phase === "Exhale") {
            setPhase("Pause");
            return phaseDurations.Pause;
          } else {
            setPhase("Inhale");
            setCyclesCompleted((c) => c + 1);
            return phaseDurations.Inhale;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase("Inhale");
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  return (
    <div className="card" style={{ padding: "24px", textAlign: "center" }}>
      <div style={{
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--primary)",
        marginBottom: "6px"
      }}>
        BOX BREATHING GROUNDING
      </div>

      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--ink)", marginBottom: "16px" }}>
        4-4-4-4 Calm Pacing
      </h3>

      {/* Pacing Circle */}
      <div style={{
        width: "120px",
        height: "120px",
        borderRadius: "var(--rounded-full)",
        backgroundColor: "var(--surface-soft)",
        border: "3px solid var(--primary)",
        margin: "0 auto 16px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.5s ease"
      }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
          {isActive ? phase : "Ready"}
        </div>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--ink)", lineHeight: 1 }}>
          {isActive ? secondsLeft : "4s"}
        </div>
      </div>

      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "18px" }}>
        {isActive
          ? `Follow the circle: ${phase} for ${secondsLeft} seconds...`
          : "Click start to begin a soothing 4-second box breathing cycle."}
      </p>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`btn ${isActive ? "btn-secondary" : "btn-primary"} btn-sm`}
        >
          {isActive ? <Pause size={14} /> : <Play size={14} />}
          <span>{isActive ? "Pause" : "Start Exercise"}</span>
        </button>

        <button onClick={handleReset} className="btn btn-secondary btn-sm" title="Reset">
          <RotateCcw size={14} />
        </button>
      </div>

      {cyclesCompleted > 0 && (
        <div style={{ fontSize: "12px", color: "var(--status-stable)", fontWeight: 700, marginTop: "12px" }}>
          ✓ {cyclesCompleted} calming cycle{cyclesCompleted > 1 ? "s" : ""} completed
        </div>
      )}
    </div>
  );
}
