"use client";

import React, { useState, useEffect } from "react";
import { apiSupport } from "../../lib/api";
import { Phone, ShieldAlert, Heart, Wind, CheckCircle, ExternalLink, HelpCircle } from "lucide-react";
import BreathingWidget from "../../components/BreathingWidget";
import DisclaimerBanner from "../../components/DisclaimerBanner";

export default function SupportPage() {
  const [supportData, setSupportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSupport() {
      try {
        const data = await apiSupport.getResources();
        setSupportData(data);
      } catch (err) {
        console.error("Failed to load support resources:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSupport();
  }, []);

  const emergencyContacts = supportData?.emergency?.contacts || [
    {
      name: "National Emergency Helpline",
      number: "112",
      available: "24/7",
      type: "Emergency Services",
      country: "India",
      description: "Police, Medical, and Emergency Response."
    },
    {
      name: "Tele-MANAS (Govt of India)",
      number: "14416 / 1800-891-4416",
      available: "24/7",
      type: "Mental Health Support",
      country: "India",
      description: "Free, multi-lingual government tele-mental health support across India."
    },
    {
      name: "KIRAN Mental Health Helpline",
      number: "1800-599-0019",
      available: "24/7",
      type: "Psychological Support",
      country: "India",
      description: "Central helpline for early screening, psychological first aid, and crisis management."
    },
    {
      name: "Vandrevala Foundation",
      number: "+91 9999 666 555",
      available: "24/7",
      type: "Crisis Counseling",
      country: "India",
      description: "Free counseling support via phone and WhatsApp."
    },
    {
      name: "International 988 Lifeline",
      number: "988",
      available: "24/7",
      type: "Crisis Lifeline",
      country: "USA & Canada",
      description: "Free and confidential support for anyone in distress."
    }
  ];

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "680px", margin: "20px auto 40px auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
          Support Directory & Crisis Helplines
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.5" }}>
          Compassionate, confidential, and verified resources to help you through difficult moments.
        </p>
      </div>

      {/* Immediate Emergency Grid */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <ShieldAlert size={20} color="var(--status-critical)" />
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>
            24/7 Verified Emergency & Crisis Helplines
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px"
        }}>
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>{contact.name}</h3>
                  <span className="badge badge-stable" style={{ fontSize: "10px" }}>{contact.available}</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", lineHeight: "1.5" }}>
                  {contact.description}
                </p>
              </div>

              <div style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--brand-primary)" }}>
                  {contact.number}
                </span>
                <a
                  href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
                  className="btn btn-primary btn-sm"
                >
                  <Phone size={12} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Grounding Section */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        {/* Breathing Widget */}
        <BreathingWidget />

        {/* 5-4-3-2-1 Sensory Grounding Guide */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Wind size={20} color="var(--status-stable)" />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
              5-4-3-2-1 Sensory Grounding
            </h3>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            Re-anchor yourself when thoughts feel overwhelming:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px" }}>
              <strong>5 things</strong> you can see right now
            </div>
            <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px" }}>
              <strong>4 things</strong> you can physically touch or feel
            </div>
            <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px" }}>
              <strong>3 things</strong> you can hear in your environment
            </div>
            <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px" }}>
              <strong>2 things</strong> you can smell or enjoy the aroma of
            </div>
            <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px" }}>
              <strong>1 positive affirmation</strong> or safe thought
            </div>
          </div>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  );
}
