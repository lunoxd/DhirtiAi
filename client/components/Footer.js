"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--bg-secondary)",
      borderTop: "1px solid var(--border-subtle)",
      padding: "36px 0 24px 0",
      marginTop: "60px"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
          marginBottom: "28px"
        }}>
          {/* Brand & Purpose */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: "#ffffff", fontSize: "16px", marginBottom: "8px" }}>
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "4px",
                backgroundColor: "var(--brand-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 900
              }}>
                D
              </div>
              DHRITI
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
              AI-assisted mental wellbeing monitoring and early distress-support platform.
            </p>
          </div>

          {/* Quick Helplines */}
          <div>
            <h4 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#ffffff", marginBottom: "10px" }}>
              24/7 Crisis Helplines
            </h4>
            <ul style={{ listStyle: "none", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li><strong>Tele-MANAS:</strong> <a href="tel:14416" style={{ color: "var(--text-link)" }}>14416</a> (India)</li>
              <li><strong>KIRAN Helpline:</strong> <a href="tel:18005990019" style={{ color: "var(--text-link)" }}>1800-599-0019</a></li>
              <li><strong>Vandrevala Foundation:</strong> <a href="tel:+919999666555" style={{ color: "var(--text-link)" }}>9999 666 555</a></li>
              <li><strong>Emergency Response:</strong> <a href="tel:112" style={{ color: "var(--status-critical)" }}>112</a></li>
            </ul>
          </div>

          {/* Platform & Privacy */}
          <div>
            <h4 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#ffffff", marginBottom: "10px" }}>
              Quick Navigation
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
              <Link href="/dashboard" style={{ transition: "color 0.15s" }}>Dashboard</Link>
              <Link href="/check-in" style={{ transition: "color 0.15s" }}>Take Check-In</Link>
              <Link href="/support" style={{ transition: "color 0.15s" }}>Helplines & Resources</Link>
              <Link href="/privacy" style={{ transition: "color 0.15s" }}>Privacy & Data Rights</Link>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div style={{
          borderTop: "1px solid var(--border-card)",
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontSize: "12px",
          color: "var(--text-muted)",
          textAlign: "center"
        }}>
          <p>
            <strong>Notice:</strong> DHRITI is designed to assist in monitoring wellbeing and recognizing changes early. The Dhriti Index is not a medical diagnosis, clinical evaluation, or psychiatric treatment.
          </p>
          <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span>Built with care for survivor safety & resilience</span>
            <Heart size={12} color="var(--brand-primary)" />
          </p>
        </div>
      </div>
    </footer>
  );
}
