"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiDoctor } from "../../lib/api";
import {
  Stethoscope,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  FileText,
  UserCheck,
  RefreshCw
} from "lucide-react";
import DisclaimerBanner from "../../components/DisclaimerBanner";

export default function DoctorPortalPage() {
  const router = useRouter();
  const { user, isDoctor, isAdmin, loading: authLoading, isAuthenticated } = useAuth();

  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [selectedCase, setSelectedCase] = useState(null);
  const [notesInput, setNotesInput] = useState("");
  const [statusInput, setStatusInput] = useState("IN_PROGRESS");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && !isDoctor && !isAdmin) {
      router.push("/dashboard");
      return;
    }

    if (isAuthenticated && (isDoctor || isAdmin)) {
      loadData();
    }
  }, [authLoading, isAuthenticated, isDoctor, isAdmin, router, statusFilter, severityFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [queueRes, statsRes] = await Promise.all([
        apiDoctor.getTriageQueue(statusFilter, severityFilter),
        apiDoctor.getStats()
      ]);

      setQueue(queueRes.queue || []);
      setStats(statsRes);
    } catch (err) {
      console.error("Failed to load doctor triage queue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCase = (item) => {
    setSelectedCase(item);
    setNotesInput(item.triageNotes || "");
    setStatusInput(item.triageStatus || "IN_PROGRESS");
  };

  const handleSaveTriage = async () => {
    if (!selectedCase) return;
    setSavingNote(true);
    try {
      await apiDoctor.updateTriageStatus(selectedCase.id, statusInput, notesInput);
      setSelectedCase(null);
      loadData();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setSavingNote(false);
    }
  };

  if (authLoading || (loading && !stats)) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Loading clinical triage dashboard...</p>
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
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(88, 101, 242, 0.18)",
            color: "var(--brand-primary)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 800,
            marginBottom: "8px"
          }}>
            <Stethoscope size={14} />
            <span>PANEL 2 — CLINICAL & HELPLINE RESPONDER PORTAL</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
            Distress Triage Queue
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Review survivor check-ins, assess distress indices, and coordinate interventions.
          </p>
        </div>

        <button onClick={loadData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Queue
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "28px"
      }}>
        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Active Critical Alerts
          </div>
          <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--status-critical)", marginTop: "4px" }}>
            {stats?.activeCritical || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Immediate review needed
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Pending Triage
          </div>
          <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--status-elevated)", marginTop: "4px" }}>
            {stats?.pendingReview || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Awaiting response
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Resolved Interventions
          </div>
          <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--status-stable)", marginTop: "4px" }}>
            {stats?.resolved || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Interventions completed
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Total Monitored Queue
          </div>
          <div style={{ fontSize: "32px", fontWeight: 900, color: "#ffffff", marginTop: "4px" }}>
            {stats?.totalFlagged || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Total flagged check-ins
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        backgroundColor: "var(--bg-secondary)",
        padding: "14px 18px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        marginBottom: "20px"
      }}>
        {/* Status Filter */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["ALL", "PENDING", "IN_PROGRESS", "CONTACTED", "RESOLVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "12px", padding: "6px 12px" }}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => setSeverityFilter("ALL")}
            className={`btn btn-sm ${severityFilter === "ALL" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "12px" }}
          >
            All Severities
          </button>
          <button
            onClick={() => setSeverityFilter("CRITICAL")}
            className={`btn btn-sm ${severityFilter === "CRITICAL" ? "btn-danger" : "btn-secondary"}`}
            style={{ fontSize: "12px" }}
          >
            Critical Only
          </button>
        </div>
      </div>

      {/* Queue List */}
      {queue.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <CheckCircle2 size={40} color="var(--status-stable)" style={{ margin: "0 auto 16px auto" }} />
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
            Triage Queue Clear
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            No check-ins currently match the selected triage filter.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {queue.map((item) => {
            const dateStr = new Date(item.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div
                key={item.id}
                onClick={() => handleOpenCase(item)}
                className="card"
                style={{
                  padding: "18px 24px",
                  cursor: "pointer",
                  borderLeft: item.safetyConcern ? "4px solid var(--status-critical)" : item.riskLevel === "Critical" ? "4px solid var(--status-critical)" : "4px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                        {item.userAlias}
                      </span>

                      <span className={`badge badge-${item.riskLevel.toLowerCase()}`}>
                        {item.riskLevel}
                      </span>

                      {item.safetyConcern && (
                        <span className="badge badge-critical" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <AlertTriangle size={12} />
                          <span>SAFETY ALERT</span>
                        </span>
                      )}

                      <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: item.triageStatus === "RESOLVED" ? "rgba(35, 165, 90, 0.2)" : item.triageStatus === "PENDING" ? "rgba(240, 178, 50, 0.2)" : "rgba(88, 101, 242, 0.2)",
                        color: item.triageStatus === "RESOLVED" ? "var(--status-stable)" : item.triageStatus === "PENDING" ? "var(--status-elevated)" : "var(--brand-primary)"
                      }}>
                        {item.triageStatus}
                      </span>
                    </div>

                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                      Submitted: <strong>{dateStr}</strong> • Trend: <strong>{item.trend}</strong> ({item.deltaPoints > 0 ? `+${item.deltaPoints}` : item.deltaPoints} pts)
                    </div>

                    {/* AI distress signal summary */}
                    {item.aiAnalysis?.distressIndicators && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                        {item.aiAnalysis.distressIndicators.slice(0, 3).map((sig, idx) => (
                          <span key={idx} style={{
                            backgroundColor: "var(--bg-tertiary)",
                            fontSize: "12px",
                            color: "var(--text-normal)",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            border: "1px solid var(--border-card)"
                          }}>
                            • {sig}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff" }}>
                      {Math.round(item.dhritiIndex)}
                      <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>/100</span>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ padding: "6px 14px" }}>
                      Review Case & Respond
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Triage & Clinical Response Modal */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff" }}>
                    {selectedCase.userAlias}
                  </h3>
                  <span className={`badge badge-${selectedCase.riskLevel.toLowerCase()}`}>
                    {selectedCase.riskLevel}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Check-in ID: {selectedCase.id} • {new Date(selectedCase.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedCase(null)} style={{ color: "var(--text-muted)" }}>
                <X size={22} />
              </button>
            </div>

            {/* Safety Warning */}
            {selectedCase.safetyConcern && (
              <div className="safety-banner" style={{ padding: "12px 16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--status-critical)", fontWeight: 700, fontSize: "14px" }}>
                  <AlertTriangle size={18} />
                  <span>Immediate Safety Override Triggered by User Responses</span>
                </div>
              </div>
            )}

            {/* Score & AI Signals */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "14px",
              marginBottom: "16px"
            }}>
              <div className="card-inner" style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Dhriti Index</div>
                <div style={{ fontSize: "40px", fontWeight: 900, color: "#ffffff" }}>
                  {Math.round(selectedCase.dhritiIndex)}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Trend: {selectedCase.trend} ({selectedCase.deltaPoints > 0 ? `+${selectedCase.deltaPoints}` : selectedCase.deltaPoints} pts)
                </div>
              </div>

              <div className="card-inner">
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase", marginBottom: "6px" }}>
                  AI Distress Extraction
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-normal)", marginBottom: "8px" }}>
                  {selectedCase.aiAnalysis?.summary || "Standard response pattern evaluated."}
                </p>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  <strong>Recommendation:</strong> {selectedCase.supportRecommendation}
                </div>
              </div>
            </div>

            {/* Written Responses if any */}
            {selectedCase.writtenResponses && Object.values(selectedCase.writtenResponses).some(t => t && t.trim().length > 0) && (
              <div className="card-inner" style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-header)", textTransform: "uppercase", marginBottom: "6px" }}>
                  User Reflections (Confidential)
                </div>
                {Object.entries(selectedCase.writtenResponses).map(([k, v]) => v ? (
                  <p key={k} style={{ fontSize: "13px", color: "var(--text-normal)", fontStyle: "italic" }}>
                    &ldquo;{v}&rdquo;
                  </p>
                ) : null)}
              </div>
            )}

            {/* Referral Quick Connect Tools */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                Intervention & Indian Helpline Dispatcher
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a href="tel:14416" className="btn btn-primary btn-sm">
                  <Phone size={13} /> Refer to Tele-MANAS (14416)
                </a>
                <a href="tel:18005990019" className="btn btn-secondary btn-sm">
                  <Phone size={13} /> Refer to KIRAN (1800-599-0019)
                </a>
                <a href="https://wa.me/919999666555" target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm">
                  <MessageSquare size={13} /> Connect via Vandrevala
                </a>
              </div>
            </div>

            {/* Clinical Notes & Status Updater */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
              <div className="form-group">
                <label className="form-label">Triage Resolution Status</label>
                <select
                  className="form-input"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                >
                  <option value="PENDING">PENDING — Needs Review</option>
                  <option value="IN_PROGRESS">IN PROGRESS — Under Evaluation</option>
                  <option value="CONTACTED">CONTACTED — Reached out to User/Helpline</option>
                  <option value="RESOLVED">RESOLVED — Support Provided & Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Clinical / Responder Notes</label>
                <textarea
                  className="form-textarea"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record internal clinical observations, counselor notes, or helpline referral details..."
                  style={{ minHeight: "80px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button onClick={() => setSelectedCase(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSaveTriage} disabled={savingNote} className="btn btn-primary">
                  <UserCheck size={16} />
                  <span>{savingNote ? "Saving..." : "Save Triage Record"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
