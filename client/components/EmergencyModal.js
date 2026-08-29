"use client";

import React, { useState } from "react";
import { Phone, ShieldAlert, X, Heart, MessageSquare, Copy, Check } from "lucide-react";

export default function EmergencyModal({ onClose, isCritical = false }) {
  const [copiedId, setCopiedId] = useState(null);

  const hotlines = [
    {
      id: "tele-manas",
      name: "Tele-MANAS (Govt. of India)",
      tel: "14416",
      display: "14416 (or 1800-891-4416)",
      tag: "National Mental Health Programme",
      desc: "Free 24/7 tele-mental health support across India in 20+ regional languages"
    },
    {
      id: "kiran",
      name: "KIRAN National Helpline",
      tel: "18005990019",
      display: "1800-599-0019",
      tag: "Ministry of Social Justice",
      desc: "24/7 psychological first aid, screening, and crisis counseling"
    },
    {
      id: "vandrevala",
      name: "Vandrevala Foundation",
      tel: "+919999666555",
      display: "+91 9999 666 555",
      tag: "Call & WhatsApp Counseling",
      desc: "24/7 free counseling in Hindi, English, Gujarati, Marathi, Tamil & Bengali",
      whatsapp: "919999666555"
    },
    {
      id: "nimhans",
      name: "NIMHANS Psychosocial Support",
      tel: "08046110007",
      display: "080-46110007",
      tag: "Bengaluru Center of Excellence",
      desc: "Expert psychological support for trauma, severe distress and mental health"
    },
    {
      id: "emergency-112",
      name: "National Emergency Response (ERSS)",
      tel: "112",
      display: "112",
      tag: "Police, Medical & Rescue",
      desc: "Immediate pan-India emergency response for safety and medical help"
    }
  ];

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "rgba(242, 63, 67, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--status-critical)"
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>
                {isCritical ? "Immediate Safety & Crisis Support" : "24/7 Verified Indian Helplines"}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Free, confidential support from trained professionals is available now.
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
          padding: "10px 14px",
          marginBottom: "16px",
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}>
          <Heart size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "var(--text-normal)" }}>
            These official helplines are toll-free and operate 24 hours a day across all Indian states.
          </span>
        </div>

        {/* Hotlines List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
          {hotlines.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "var(--bg-tertiary)",
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
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "#ffffff" }}>{item.name}</span>
                  <span className="badge badge-stable" style={{ fontSize: "10px", padding: "2px 6px" }}>{item.tag}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{item.desc}</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--brand-primary)", marginTop: "4px" }}>
                  {item.display}
                </div>
              </div>

              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => handleCopy(item.id, item.tel)}
                  className="btn btn-secondary btn-sm"
                  title="Copy Number"
                  style={{ padding: "6px 8px" }}
                >
                  {copiedId === item.id ? <Check size={14} color="var(--status-stable)" /> : <Copy size={14} />}
                </button>

                {item.whatsapp && (
                  <a
                    href={`https://wa.me/${item.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                    style={{ padding: "6px 10px" }}
                  >
                    <MessageSquare size={13} /> WA
                  </a>
                )}

                <a
                  href={`tel:${item.tel}`}
                  className="btn btn-primary btn-sm"
                  style={{ padding: "6px 12px" }}
                >
                  <Phone size={13} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Actions */}
        <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
