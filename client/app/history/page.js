"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiCheckIns } from "../../lib/api";
import { History as HistoryIcon, Trash2, ArrowLeft, PlusCircle, AlertTriangle, X } from "lucide-react";
import DisclaimerBanner from "../../components/DisclaimerBanner";

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
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
    try {
      const res = await apiCheckIns.getHistory();
      setCheckIns(res.checkIns || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this check-in record?")) return;

    setDeletingId(id);
    try {
      await apiCheckIns.deleteById(id);
      setCheckIns((prev) => prev.filter((item) => item.id !== id));
      if (selectedCheckIn?.id === id) {
        setSelectedCheckIn(null);
      }
    } catch (err) {
      alert("Failed to delete record: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
            Check-in History
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Review past wellbeing check-ins and track your personal journey
          </p>
        </div>

        <Link href="/check-in" className="btn btn-primary">
          <PlusCircle size={16} /> New Check-in
        </Link>
      </div>

      {checkIns.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <HistoryIcon size={40} color="var(--text-muted)" style={{ margin: "0 auto 16px auto" }} />
          <h2 style={{ fontSize: "18px", color: "#ffffff", marginBottom: "8px" }}>No past check-ins yet</h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
            Take your first check-in to begin tracking your wellbeing over time.
          </p>
          <Link href="/check-in" className="btn btn-primary">Start First Check-in</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {checkIns.map((ci) => {
            const dateStr = new Date(ci.createdAt).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div
                key={ci.id}
                onClick={() => setSelectedCheckIn(ci)}
                className="card"
                style={{
                  padding: "18px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease, border-color 0.15s ease"
                }}
              >
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
                    {dateStr}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Trend: <strong style={{ color: "var(--text-normal)" }}>{ci.trend}</strong>
                    {ci.deltaPoints !== 0 && ` (${ci.deltaPoints > 0 ? `+${ci.deltaPoints}` : ci.deltaPoints} pts)`}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>
                      {Math.round(ci.dhritiIndex)}
                      <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>/100</span>
                    </div>
                  </div>

                  <span className={`badge badge-${ci.riskLevel.toLowerCase()}`}>
                    {ci.riskLevel}
                  </span>

                  <button
                    onClick={(e) => handleDelete(ci.id, e)}
                    disabled={deletingId === ci.id}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "8px", color: "var(--text-muted)" }}
                    title="Delete this record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Check-in Modal */}
      {selectedCheckIn && (
        <div className="modal-overlay" onClick={() => setSelectedCheckIn(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>
                  Check-in Details
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {new Date(selectedCheckIn.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedCheckIn(null)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "var(--radius-md)",
                padding: "16px 24px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Dhriti Index</div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#ffffff" }}>{Math.round(selectedCheckIn.dhritiIndex)}</div>
              </div>
              <div>
                <span className={`badge badge-${selectedCheckIn.riskLevel.toLowerCase()}`} style={{ fontSize: "13px", padding: "6px 12px" }}>
                  {selectedCheckIn.riskLevel}
                </span>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>
                  Trend: {selectedCheckIn.trend} ({selectedCheckIn.deltaPoints > 0 ? `+${selectedCheckIn.deltaPoints}` : selectedCheckIn.deltaPoints} pts)
                </p>
              </div>
            </div>

            {selectedCheckIn.supportRecommendation && (
              <div style={{ backgroundColor: "var(--bg-tertiary)", padding: "14px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase", marginBottom: "4px" }}>
                  Recommendation
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-normal)" }}>{selectedCheckIn.supportRecommendation}</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
              <button onClick={() => setSelectedCheckIn(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: "32px" }}>
        <DisclaimerBanner />
      </div>
    </div>
  );
}
