"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard for fixed full-viewport experience
  if (pathname === "/dashboard") {
    return null;
  }

  return (
    <footer style={{
      backgroundColor: "#1e1f22",
      color: "#ffffff",
      borderTop: "1px solid var(--hairline)",
      padding: "64px 0 36px 0",
      marginTop: "80px"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "36px",
          marginBottom: "48px"
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 800, color: "#ffffff", fontSize: "18px", marginBottom: "12px" }}>
              <img
                src="/logo.png"
                alt="Dhriti Logo"
                style={{
                  height: "28px",
                  width: "auto",
                  objectFit: "contain"
                }}
              />
              <span>Dhriti</span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
              AI-assisted mental wellbeing monitoring and early distress-support platform for survivors and individuals in acute distress.
            </p>
          </div>

          {/* Helplines Col */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", marginBottom: "14px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              24/7 Verified Helplines (India)
            </h4>
            <ul style={{ listStyle: "none", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Tele-MANAS:</strong> <a href="tel:14416" style={{ color: "#ffffff", textDecoration: "underline" }}>14416</a> (Toll-Free)</li>
              <li><strong>KIRAN Helpline:</strong> <a href="tel:18005990019" style={{ color: "#ffffff", textDecoration: "underline" }}>1800-599-0019</a></li>
              <li><strong>Vandrevala Crisis:</strong> <a href="tel:+919999666555" style={{ color: "#ffffff", textDecoration: "underline" }}>+91 9999 666 555</a></li>
              <li><strong>NIMHANS Support:</strong> <a href="tel:08046110007" style={{ color: "#ffffff", textDecoration: "underline" }}>080-46110007</a></li>
              <li><strong>Emergency Services:</strong> <a href="tel:112" style={{ color: "var(--error)", fontWeight: 700 }}>112</a></li>
            </ul>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", marginBottom: "14px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Platform Navigation
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
              <Link href="/dashboard" style={{ transition: "color 0.15s" }}>Dashboard</Link>
              <Link href="/check-in" style={{ transition: "color 0.15s" }}>Start Check-in</Link>
              <Link href="/doctor" style={{ transition: "color 0.15s" }}>Doctor Triage</Link>
              <Link href="/support" style={{ transition: "color 0.15s" }}>Helplines & Resources</Link>
              <Link href="/privacy" style={{ transition: "color 0.15s" }}>Privacy & Data Rights</Link>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div style={{
          borderTop: "1px solid var(--hairline)",
          paddingTop: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontSize: "12px",
          color: "var(--text-muted)",
          textAlign: "center"
        }}>
          <p>
            <strong>Medical Disclaimer:</strong> DHRITI is designed to assist in monitoring wellbeing and recognizing changes early. The Dhriti Index is a distress-risk indicator, not a medical diagnosis or clinical prescription.
          </p>
          <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "var(--text-muted)" }}>
            <span>Built with care for survivor safety & resilience</span>
            <Heart size={12} color="var(--primary)" />
          </p>
        </div>
      </div>
    </footer>
  );
}
