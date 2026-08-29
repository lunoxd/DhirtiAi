"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiDoctor } from "../../lib/api";
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageSquare,
  X,
  RefreshCw,
  UserCheck,
  PhoneCall
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
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Loading clinical triage dashboard...</p>
      </div>
    );
  }

  const callbackRequestsCount = queue.filter(q => q.triageStatus === "PENDING_DOCTOR_CALLBACK" || q.safetyConcern).length;

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "28px"
      }}>
        <div>
          <div className="nav-pill-group" style={{ marginBottom: "12px" }}>
            <span className="badge" style={{ backgroundColor: "var(--primary)", color: "#ffffff", padding: "2px 8px" }}>
              Panel 2
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", paddingRight: "8px" }}>
              Clinical & Helpline Responder Portal
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "4px" }}>
            Distress Triage & Callback Queue
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Review survivor check-ins, process doctor callback requests, and coordinate crisis support.
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
        <div className="card" style={{ padding: "20px", border: callbackRequestsCount > 0 ? "1px solid var(--primary)" : "1px solid var(--hairline)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Doctor Callback Requests
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>
            {callbackRequestsCount}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            High distress / user requested
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Active Critical Cases
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--status-critical)", marginTop: "4px" }}>
            {stats?.activeCritical || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Immediate review recommended
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Pending Triage
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--status-elevated)", marginTop: "4px" }}>
            {stats?.pendingReview || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Awaiting responder action
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Resolved Interventions
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--status-stable)", marginTop: "4px" }}>
            {stats?.resolved || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Support completed
          </div>
        </div>
      </div>

      {/* Filter Pill Group Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "24px"
      }}>
        {/* Status Pill Group */}
        <div className="nav-pill-group">
          {["ALL", "PENDING_DOCTOR_CALLBACK", "PENDING", "IN_PROGRESS", "CONTACTED", "RESOLVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`nav-pill-item ${statusFilter === st ? "active" : ""}`}
            >
              {st === "PENDING_DOCTOR_CALLBACK" ? "🚨 DOCTOR CALLBACKS" : st.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="nav-pill-group">
          <button
            onClick={() => setSeverityFilter("ALL")}
            className={`nav-pill-item ${severityFilter === "ALL" ? "active" : ""}`}
          >
            All Severities
          </button>
          <button
            onClick={() => setSeverityFilter("CRITICAL")}
            className={`nav-pill-item ${severityFilter === "CRITICAL" ? "active" : ""}`}
            style={{ color: severityFilter === "CRITICAL" ? "var(--error)" : undefined }}
          >
            Critical Only
          </button>
        </div>
      </div>

      {/* Queue List */}
      {queue.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <CheckCircle2 size={40} color="var(--status-stable)" style={{ margin: "0 auto 16px auto" }} />
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
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

            const isDoctorCallbackRequested = item.triageStatus === "PENDING_DOCTOR_CALLBACK";

            return (
              <div
                key={item.id}
                onClick={() => handleOpenCase(item)}
                className="card"
                style={{
                  padding: "20px 24px",
                  cursor: "pointer",
                  backgroundColor: isDoctorCallbackRequested ? "#2f2428" : "#2b2d31",
                  borderLeft: isDoctorCallbackRequested ? "4px solid var(--primary)" : item.safetyConcern ? "4px solid var(--status-critical)" : item.riskLevel === "Critical" ? "4px solid var(--status-critical)" : "1px solid var(--hairline)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                        {item.userAlias} ({item.userEmail || "Anonymous"})
                      </span>

                      <span className={`badge badge-${item.riskLevel.toLowerCase()}`}>
                        {item.riskLevel}
                      </span>

                      {isDoctorCallbackRequested && (
                        <span className="badge" style={{ backgroundColor: "var(--primary)", color: "#ffffff", display: "flex", alignItems: "center", gap: "4px", fontWeight: 800 }}>
                          <PhoneCall size={12} />
                          <span>DOCTOR CALLBACK REQUESTED</span>
                        </span>
                      )}

                      {item.safetyConcern && !isDoctorCallbackRequested && (
                        <span className="badge badge-critical" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <AlertTriangle size={12} />
                          <span>SAFETY ALERT</span>
                        </span>
                      )}

                      <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--rounded-pill)",
                        backgroundColor: item.triageStatus === "RESOLVED" ? "rgba(35, 165, 90, 0.2)" : item.triageStatus === "PENDING_DOCTOR_CALLBACK" ? "rgba(245, 36, 67, 0.2)" : "rgba(88, 101, 242, 0.2)",
                        color: item.triageStatus === "RESOLVED" ? "var(--status-stable)" : item.triageStatus === "PENDING_DOCTOR_CALLBACK" ? "var(--primary)" : "var(--text-body)"
                      }}>
                        {item.triageStatus}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Submitted: <strong>{dateStr}</strong> • Trend: <strong>{item.trend}</strong> ({item.deltaPoints > 0 ? `+${item.deltaPoints}` : item.deltaPoints} pts)
                    </div>

                    {item.aiAnalysis?.distressIndicators && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                        {item.aiAnalysis.distressIndicators.slice(0, 3).map((sig, idx) => (
                          <span key={idx} style={{
                            backgroundColor: "#1e1f22",
                            fontSize: "12px",
                            color: "#dbdee1",
                            padding: "3px 8px",
                            borderRadius: "var(--rounded-sm)",
                            border: "1px solid var(--hairline)"
                          }}>
                            • {sig}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff" }}>
                      {Math.round(item.dhritiIndex)}
                      <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>/100</span>
                    </div>
                    <button className="btn btn-primary btn-sm">
                      Review Case & Respond
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Triage Modal */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff" }}>
                    {selectedCase.userAlias} ({selectedCase.userEmail})
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

            {selectedCase.triageStatus === "PENDING_DOCTOR_CALLBACK" && (
              <div className="safety-banner" style={{ padding: "12px 16px", marginBottom: "16px", backgroundColor: "rgba(245, 36, 67, 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ffffff", fontWeight: 800, fontSize: "14px" }}>
                  <PhoneCall size={18} color="var(--primary)" />
                  <span>USER REQUESTED DOCTOR CONSULTATION & CALLBACK</span>
                </div>
              </div>
            )}

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "14px",
              marginBottom: "16px"
            }}>
              <div className="card-inner" style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Dhriti Index</div>
                <div style={{ fontSize: "40px", fontWeight: 800, color: "#ffffff" }}>
                  {Math.round(selectedCase.dhritiIndex)}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Trend: {selectedCase.trend} ({selectedCase.deltaPoints > 0 ? `+${selectedCase.deltaPoints}` : selectedCase.deltaPoints} pts)
                </div>
              </div>

              <div className="card-inner">
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", marginBottom: "6px" }}>
                  AI Distress Extraction
                </div>
                <p style={{ fontSize: "13px", color: "#dbdee1", marginBottom: "8px" }}>
                  {selectedCase.aiAnalysis?.summary || "Standard response pattern evaluated."}
                </p>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  <strong>Recommendation:</strong> {selectedCase.supportRecommendation}
                </div>
              </div>
            </div>

            {/* Written reflections */}
            {selectedCase.writtenResponses && Object.values(selectedCase.writtenResponses).some(t => t && t.trim().length > 0) && (
              <div className="card-inner" style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff", textTransform: "uppercase", marginBottom: "6px" }}>
                  User Reflections (Confidential)
                </div>
                {Object.entries(selectedCase.writtenResponses).map(([k, v]) => v ? (
                  <p key={k} style={{ fontSize: "13px", color: "#dbdee1", fontStyle: "italic" }}>
                    &ldquo;{v}&rdquo;
                  </p>
                ) : null)}
              </div>
            )}

            {/* Referral Dispatcher */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                Verified Helpline Quick Dispatcher
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a href="tel:14416" className="btn btn-primary btn-sm">
                  <Phone size={13} /> Call Tele-MANAS (14416)
                </a>
                <a href="tel:18005990019" className="btn btn-secondary btn-sm">
                  <Phone size={13} /> Call KIRAN (1800-599-0019)
                </a>
                <a href="tel:+919999666555" className="btn btn-success btn-sm">
                  <Phone size={13} /> Vandrevala (+91 9999 666 555)
                </a>
              </div>
            </div>

            {/* Clinical Notes & Status Updater */}
            <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: "16px" }}>
              <div className="form-group">
                <label className="form-label">Triage Resolution Status</label>
                <select
                  className="form-input"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                >
                  <option value="PENDING_DOCTOR_CALLBACK">PENDING DOCTOR CALLBACK</option>
                  <option value="IN_PROGRESS">IN PROGRESS — Under Evaluation</option>
                  <option value="CONTACTED">CONTACTED — Reached out to User</option>
                  <option value="RESOLVED">RESOLVED — Support Provided & Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Clinical / Responder Notes</label>
                <textarea
                  className="form-textarea"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record internal clinical observations, counselor notes, or callback details..."
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
