"use client";

import React, { useState, useEffect } from "react";
import { apiSupport } from "../../lib/api";
import { Phone, ShieldAlert, Heart, Wind, MessageSquare, Copy, Check, Filter, ExternalLink, Globe } from "lucide-react";
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
    { key: "all", label: "All Resources" },
    { key: "government", label: "National & Govt" },
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
      <div style={{ textAlign: "center", maxWidth: "720px", margin: "20px auto 36px auto" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: 700,
          color: "var(--brand-primary)",
          marginBottom: "16px"
        }}>
          <Heart size={14} />
          <span>India Mental Health & Survivor Support Directory</span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
          Verified Helplines & Grounding Support
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.5" }}>
          Free, confidential, and multi-lingual psychological first-aid lines operating across India.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "28px"
      }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`btn btn-sm ${activeCategory === cat.key ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "20px" }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Indian Helplines Grid */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px"
        }}>
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px", gap: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>{contact.name}</h3>
                  <span className="badge badge-stable" style={{ fontSize: "10px", flexShrink: 0 }}>{contact.available}</span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--brand-primary)", fontWeight: 600, marginBottom: "8px" }}>
                  {contact.tag}
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-normal)", marginBottom: "12px", lineHeight: "1.5" }}>
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
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Toll-Free / Dial</div>
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
                      title="Connect on WhatsApp"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  <a
                    href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Phone size={13} />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Grounding Section */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {/* Breathing Widget */}
        <BreathingWidget />

        {/* 5-4-3-2-1 Sensory Grounding Guide */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Wind size={20} color="var(--status-stable)" />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
              5-4-3-2-1 Sensory Grounding Practice
            </h3>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            Re-anchor yourself to the present moment if distressing memories arise:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px", border: "1px solid var(--border-card)" }}>
              <strong style={{ color: "var(--brand-primary)" }}>5 things</strong> you can see right now
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px", border: "1px solid var(--border-card)" }}>
              <strong style={{ color: "var(--brand-primary)" }}>4 things</strong> you can physically touch or feel
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px", border: "1px solid var(--border-card)" }}>
              <strong style={{ color: "var(--brand-primary)" }}>3 sounds</strong> you can hear in your environment
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px", border: "1px solid var(--border-card)" }}>
              <strong style={{ color: "var(--brand-primary)" }}>2 scents</strong> you can smell or enjoy
            </div>
            <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-tertiary)", borderRadius: "6px", border: "1px solid var(--border-card)" }}>
              <strong style={{ color: "var(--brand-primary)" }}>1 reassuring thought</strong> (&ldquo;I am safe in this moment&rdquo;)
            </div>
          </div>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  );
}
