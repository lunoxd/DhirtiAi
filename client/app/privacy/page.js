"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiCheckIns } from "../../lib/api";
import { Shield, Trash2, Lock, EyeOff, CheckCircle2, AlertTriangle, X } from "lucide-react";
import DisclaimerBanner from "../../components/DisclaimerBanner";

export default function PrivacyPage() {
  const { isAuthenticated } = useAuth();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handlePermanentDelete = async () => {
    setDeleting(true);
    try {
      const res = await apiCheckIns.deleteAll();
      setConfirmModalOpen(false);
      setMessage(`Successfully deleted ${res.deletedCount || 0} check-in records.`);
    } catch (err) {
      alert("Failed to wipe data: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container-narrow" style={{ paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
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
          <Shield size={16} />
          <span>Survivor-Centered Data Policy</span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff" }}>
          Privacy, Safety & Data Control
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px" }}>
          Your check-ins belong to you. We believe in radical transparency and absolute user control.
        </p>
      </div>

      {message && (
        <div style={{
          backgroundColor: "rgba(35, 165, 90, 0.15)",
          border: "1px solid var(--status-stable)",
          borderRadius: "var(--radius-md)",
          padding: "14px 18px",
          color: "var(--status-stable)",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px"
        }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Privacy Principles */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Lock size={18} color="var(--brand-primary)" />
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>What Information We Collect</h2>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            We only store the structured numerical responses and any optional text you choose to write during check-ins. No intrusive trackers, third-party advertising cookies, or unnecessary device fingerprints are used.
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <EyeOff size={18} color="var(--brand-primary)" />
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>How AI Processing Works</h2>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            Qualitative analysis is processed strictly on secure backend servers using the Groq API. Your responses are never used to train public LLMs. AI output is constrained to conservative distress extraction and never generates medical diagnoses.
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <CheckCircle2 size={18} color="var(--status-stable)" />
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>Deterministic Score Engine</h2>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            The 0–100 Dhriti Index is calculated by fixed mathematical weights in our scoring engine, ensuring transparent, reliable, and auditable metrics without hallucination.
          </p>
        </div>
      </div>

      {/* Wipe Data Section */}
      <div className="card" style={{ border: "1px solid rgba(242, 63, 67, 0.4)", backgroundColor: "rgba(242, 63, 67, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Trash2 size={20} color="var(--status-critical)" />
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>Permanently Delete Your Check-in Data</h2>
        </div>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.5" }}>
          You have the absolute right to erase all your check-in records, historical score points, and AI reflections permanently from our database.
        </p>

        {isAuthenticated ? (
          <button
            onClick={() => setConfirmModalOpen(true)}
            className="btn btn-danger"
          >
            <Trash2 size={16} />
            <span>Delete My Check-in Data</span>
          </button>
        ) : (
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Please log in to manage or delete your stored check-ins.
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="modal-overlay" onClick={() => setConfirmModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertTriangle size={24} color="var(--status-critical)" />
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>
                  Confirm Data Deletion
                </h3>
              </div>
              <button onClick={() => setConfirmModalOpen(false)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: "14px", color: "var(--text-normal)", marginBottom: "24px", lineHeight: "1.5" }}>
              Are you sure you want to permanently delete all your check-in records? This action cannot be undone.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: "36px" }}>
        <DisclaimerBanner />
      </div>
    </div>
  );
}
