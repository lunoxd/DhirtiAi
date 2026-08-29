"use client";

import React from "react";
import { Info } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div style={{
      backgroundColor: "var(--bg-tertiary)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "13px",
      color: "var(--text-muted)",
      margin: "16px 0"
    }}>
      <Info size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
      <span>
        <strong>Medical Disclaimer:</strong> DHRITI is an AI-assisted mental wellbeing monitoring and distress-support tool. It does not provide medical or psychiatric diagnoses. If you are experiencing an emergency, please connect directly with professional crisis services.
      </span>
    </div>
  );
}
