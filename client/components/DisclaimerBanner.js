"use client";

import React from "react";
import { Info } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div style={{
      backgroundColor: "var(--surface-soft)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--rounded-md)",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "13px",
      color: "var(--text-muted)",
      margin: "20px 0"
    }}>
      <Info size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
      <span>
        <strong style={{ color: "var(--ink)" }}>Medical Disclaimer:</strong> DHRITI is an AI-assisted mental wellbeing monitoring and early distress-support platform. It does not provide medical or psychiatric diagnoses. If you are experiencing an emergency, please connect directly with professional crisis services.
      </span>
    </div>
  );
}
