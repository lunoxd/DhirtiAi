"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiCheckIns } from "../../lib/api";
import { History, PlusCircle, Trash2, Calendar, AlertTriangle, X, ShieldAlert } from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadHistory();
    }
  }, [authLoading, isAuthenticated, router]);

  const loadHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiCheckIns.getHistory();
      setCheckIns(res.checkIns || []);
    } catch (err) {
      console.error("Load History Error:", err);
      setError(err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this check-in record?")) return;
    setDeletingId(id);
    try {
      await apiCheckIns.deleteById(id);
      setCheckIns((prev) => prev.filter((item) => item.id !== id));
      if (selectedCheckIn?.id === id) setSelectedCheckIn(null);
    } catch (err) {
      alert(err.message || "Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container-narrow" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading check-in history...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "20px", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--ink)", marginBottom: "4px" }}>
            Check-in History
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Review past mental wellbeing assessments and trends over time.
          </p>
        </div>

        <Link href="/check-in" className="btn btn-primary btn-sm">
          <PlusCircle size={15} /> Start New Check-in
        </Link>
      </div>

      {error && (
        <div style={{ backgroundColor: "rgba(245, 36, 67, 0.12)", border: "1px solid var(--status-critical)", padding: "12px", borderRadius: "8px", color: "var(--status-critical)", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {checkIns.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 24px" }}>
          <History size={36} color="var(--text-muted)" style={{ margin: "0 auto 12px auto" }} />
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink)", marginBottom: "8px" }}>
            No History Found
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
            You have not completed any mental wellbeing check-ins yet.
          </p>
          <Link href="/check-in" className="btn btn-primary">
            Start Your First Check-in
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {checkIns.map((item) => {
            const dateObj = new Date(item.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric"
            });
            const formattedTime = dateObj.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--rounded-md)",
                    backgroundColor: "var(--surface-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "var(--ink)"
                  }}>
                    {Math.round(item.dhritiIndex)}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--ink)" }}>{formattedDate}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>at {formattedTime}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                      <span className={`badge badge-${item.riskLevel.toLowerCase()}`}>
                        {item.riskLevel} Risk
                      </span>
                      {item.safetyConcern && (
                        <span className="badge badge-critical" style={{ fontSize: "11px" }}>
                          <ShieldAlert size={12} /> Safety Concern Flagged
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => setSelectedCheckIn(item)}
                    className="btn btn-secondary btn-sm"
                  >
                    Inspect Details
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="btn btn-secondary btn-sm"
                    style={{ color: "var(--error)" }}
                    title="Delete Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Modal */}
      {selectedCheckIn && (
        <div className="modal-overlay" onClick={() => setSelectedCheckIn(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink)" }}>
                  Check-in Assessment Details
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {new Date(selectedCheckIn.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedCheckIn(null)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <div className="card-inner" style={{ marginBottom: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>DHRITI INDEX</div>
              <div style={{ fontSize: "40px", fontWeight: 800, color: "var(--ink)" }}>
                {Math.round(selectedCheckIn.dhritiIndex)}
                <span style={{ fontSize: "16px", color: "var(--text-muted)" }}>/100</span>
              </div>
              <span className={`badge badge-${selectedCheckIn.riskLevel.toLowerCase()}`}>
                {selectedCheckIn.riskLevel} Risk Level
              </span>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", marginBottom: "6px" }}>
                Support Recommendation:
              </h4>
              <p style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: "1.5" }}>
                {selectedCheckIn.supportRecommendation}
              </p>
            </div>

            {selectedCheckIn.aiAnalysis && selectedCheckIn.aiAnalysis.summary && (
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", marginBottom: "6px" }}>
                  AI Observations:
                </h4>
                <p style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: "1.5" }}>
                  {selectedCheckIn.aiAnalysis.summary}
                </p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button onClick={() => setSelectedCheckIn(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
