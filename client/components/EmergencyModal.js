"use client";

import React from "react";
import { Phone, ShieldAlert, X, Heart, ExternalLink } from "lucide-react";

export default function EmergencyModal({ onClose, isCritical = false }) {
  const hotlines = [
    {
      name: "Tele-MANAS (Govt of India)",
      tel: "14416",
      display: "14416 / 1800-891-4416",
      desc: "Free 24/7 tele-mental health support across India (Multiple languages)"
    },
    {
      name: "KIRAN Mental Health Helpline",
      tel: "18005990019",
      display: "1800-599-0019",
      desc: "24/7 psychological first aid & crisis management"
    },
    {
      name: "Vandrevala Foundation",
      tel: "+919999666555",
      display: "+91 9999 666 555",
      desc: "24/7 free counseling via phone & WhatsApp"
    },
    {
      name: "National Emergency Helpline",
      tel: "112",
      display: "112",
      desc: "Immediate Police / Ambulance / Safety Response"
    },
    {
      name: "International 988 Lifeline",
      tel: "988",
      display: "988 (USA/Canada)",
      desc: "24/7 Suicide & Crisis Lifeline"
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "rgba(242, 63, 67, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--status-critical)"
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>
                {isCritical ? "Immediate Safety Support" : "24/7 Verified Helplines"}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                You are not alone. Confidential, compassionate help is available right now.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: "var(--text-muted)",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Supportive Note */}
        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          border: "1px solid var(--border-card)",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}>
          <Heart size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "var(--text-normal)" }}>
            These resources are free, confidential, and run by trained human support professionals.
          </span>
        </div>

        {/* Hotlines List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
          {hotlines.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#ffffff" }}>{item.name}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{item.desc}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--brand-primary)", marginTop: "4px" }}>
                  {item.display}
                </div>
              </div>
              <a
                href={`tel:${item.tel}`}
                className="btn btn-primary btn-sm"
                style={{ flexShrink: 0, padding: "8px 14px" }}
              >
                <Phone size={14} /> Call Now
              </a>
            </div>
          ))}
        </div>

        {/* Modal Actions */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
