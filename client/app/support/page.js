"use client";

import React, { useState, useEffect } from "react";
import { apiSupport } from "../../lib/api";
import { Phone, MessageSquare, Copy, Check, Globe, Wind } from "lucide-react";
import BreathingWidget from "../../components/BreathingWidget";
import DisclaimerBanner from "../../components/DisclaimerBanner";

export default function SupportPage() {
  const [supportData, setSupportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const emergencyContacts = supportData?.emergency?.contacts || [];

  const categories = [
    { key: "all", label: "All Helplines" },
    { key: "government", label: "National Govt" },
    { key: "crisis", label: "24/7 Crisis" },
    { key: "women_trauma", label: "Survivor & Trauma" },
    { key: "counseling", label: "Psychosocial Support" }
  ];

  const filteredContacts = activeCategory === "all"
    ? emergencyContacts
    : emergencyContacts.filter(c => c.category === activeCategory);

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: "680px", margin: "20px auto 36px auto" }}>
        <div className="nav-pill-group" style={{ marginBottom: "16px" }}>
          <span className="badge" style={{ backgroundColor: "var(--primary)", color: "#ffffff", padding: "2px 8px" }}>
            India
          </span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", paddingRight: "8px" }}>
            Verified Helplines & Grounding Directory
          </span>
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Crisis Helplines & Grounding Tools
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.5" }}>
          Free, confidential, and multi-lingual psychological first-aid lines operating across all Indian states.
        </p>
      </div>

      {/* Category Filter Pill Group */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
        <div className="nav-pill-group" style={{ flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`nav-pill-item ${activeCategory === cat.key ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Helplines Grid */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px"
        }}>
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "24px",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px", gap: "8px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>{contact.name}</h3>
                  <span className="badge badge-stable" style={{ fontSize: "10px", flexShrink: 0 }}>{contact.available}</span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 700, marginBottom: "8px" }}>
                  {contact.tag}
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-body)", marginBottom: "12px", lineHeight: "1.5" }}>
                  {contact.description}
                </p>

                {contact.languages && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                    <Globe size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <span>{contact.languages}</span>
                  </div>
                )}
              </div>

              {/* Action Box */}
              <div style={{
                backgroundColor: "var(--surface-soft)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--rounded-md)",
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em" }}>Dial / Toll-Free</div>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff" }}>
                    {contact.number}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => handleCopy(contact.id, contact.number)}
                    className="btn btn-secondary btn-sm"
                    title="Copy Helpline Number"
                    style={{ padding: "6px 8px" }}
                  >
                    {copiedId === contact.id ? <Check size={14} color="var(--status-stable)" /> : <Copy size={14} />}
                  </button>

                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success btn-sm"
                      style={{ padding: "6px 10px" }}
                      title="WhatsApp Chat"
                    >
                      <MessageSquare size={13} />
                    </a>
                  )}

                  <a
                    href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grounding Section */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        <BreathingWidget />

        <div className="card-gray" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Wind size={18} color="var(--primary)" />
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
              5-4-3-2-1 Sensory Grounding Guide
            </h3>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            Re-anchor yourself to the present room if distressing memories arise:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--surface-soft)", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)" }}>
              <strong style={{ color: "#ffffff" }}>5 things</strong> you can see right now
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--surface-soft)", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)" }}>
              <strong style={{ color: "#ffffff" }}>4 things</strong> you can physically touch or feel
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--surface-soft)", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)" }}>
              <strong style={{ color: "#ffffff" }}>3 sounds</strong> you can hear in your environment
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--surface-soft)", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)" }}>
              <strong style={{ color: "#ffffff" }}>2 scents</strong> you can smell or enjoy
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--surface-soft)", borderRadius: "var(--rounded-md)", border: "1px solid var(--hairline)" }}>
              <strong style={{ color: "#ffffff" }}>1 reassuring thought</strong> (&ldquo;I am safe right now&rdquo;)
            </div>
          </div>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  );
}
