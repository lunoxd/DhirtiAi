"use client";

import React, { useState, useEffect } from "react";
import { Play, Square, Wind } from "lucide-react";

export default function BreathingWidget() {
  const [isActive, setIsActive] = useState(false);
  const [technique, setTechnique] = useState("478");
  const [phase, setPhase] = useState("Ready");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (!isActive) {
      setPhase("Ready");
      setCountdown(0);
      return;
    }

    const phases478 = [
      { name: "Inhale slowly through nose", duration: 4 },
      { name: "Hold your breath gently", duration: 7 },
      { name: "Exhale fully through mouth", duration: 8 }
    ];

    const phasesBox = [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 4 },
      { name: "Exhale", duration: 4 },
      { name: "Hold Empty", duration: 4 }
    ];

    const currentPhases = technique === "478" ? phases478 : phasesBox;
    let phaseIndex = 0;
    let secondsLeft = currentPhases[0].duration;

    setPhase(currentPhases[0].name);
    setCountdown(secondsLeft);

    timer = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        phaseIndex = (phaseIndex + 1) % currentPhases.length;
        secondsLeft = currentPhases[phaseIndex].duration;
        setPhase(currentPhases[phaseIndex].name);
      }
      setCountdown(secondsLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, technique]);

  return (
    <div className="card-gray" style={{ textAlign: "center", padding: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px" }}>
        <Wind size={18} color="var(--primary)" />
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>Guided Grounding & Calming Breath</h3>
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
        Use this pacing tool to calm your nervous system when feeling overwhelmed.
      </p>

      {/* Technique Selector Pill Group */}
      <div className="nav-pill-group" style={{ marginBottom: "24px" }}>
        <button
          onClick={() => { setTechnique("478"); setIsActive(false); }}
          className={`nav-pill-item ${technique === "478" ? "active" : ""}`}
        >
          4-7-8 Relaxation
        </button>
        <button
          onClick={() => { setTechnique("box"); setIsActive(false); }}
          className={`nav-pill-item ${technique === "box" ? "active" : ""}`}
        >
          Box Breathing (4x4)
        </button>
      </div>

      {/* Visual Breathing Circle */}
      <div style={{
        margin: "0 auto 24px auto",
        width: "150px",
        height: "150px",
        borderRadius: "var(--rounded-full)",
        backgroundColor: "var(--surface-soft)",
        border: "2px solid var(--hairline)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        transition: "transform 4s ease-in-out, border-color 0.5s ease",
        transform: isActive && phase.startsWith("Inhale") ? "scale(1.12)" : isActive && phase.startsWith("Exhale") ? "scale(0.92)" : "scale(1)",
        borderColor: isActive ? "var(--primary)" : "var(--hairline)"
      }}>
        <div style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
          {isActive ? countdown : <Wind size={30} color="var(--text-muted)" />}
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, marginTop: "4px", padding: "0 10px" }}>
          {phase}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {!isActive ? (
          <button onClick={() => setIsActive(true)} className="btn btn-primary btn-sm">
            <Play size={14} /> Begin Exercise
          </button>
        ) : (
          <button onClick={() => setIsActive(false)} className="btn btn-secondary btn-sm">
            <Square size={14} /> Stop
          </button>
        )}
      </div>
    </div>
  );
}
