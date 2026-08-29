"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiAdmin } from "../../lib/api";
import {
  ShieldCheck,
  Users,
  Activity,
  Trash2,
  Edit3,
  RefreshCw,
  X
} from "lucide-react";
import DisclaimerBanner from "../../components/DisclaimerBanner";

export default function AdminPortalPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [checkInsList, setCheckInsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState("USER");
  const [editOrg, setEditOrg] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && !isAdmin) {
      router.push("/dashboard");
      return;
    }

    if (isAuthenticated && isAdmin) {
      loadAdminData();
    }
  }, [authLoading, isAuthenticated, isAdmin, router, roleFilter, riskFilter]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [overRes, usersRes, checkInsRes] = await Promise.all([
        apiAdmin.getOverview(),
        apiAdmin.getUsers(roleFilter, searchQuery),
        apiAdmin.getCheckIns(riskFilter)
      ]);

      setOverview(overRes);
      setUsersList(usersRes.users || []);
      setCheckInsList(checkInsRes.checkIns || []);
    } catch (err) {
      console.error("Admin Data Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (u) => {
    setEditingUser(u);
    setEditRole(u.role);
    setEditOrg(u.organization || "");
    setEditStatus(u.status || "ACTIVE");
  };

  const handleSaveUserRole = async () => {
    if (!editingUser) return;
    setActionLoading(true);
    try {
      await apiAdmin.updateUserRole(editingUser.id, editRole, editOrg, editingUser.specialization, editStatus);
      setEditingUser(null);
      loadAdminData();
    } catch (err) {
      alert("Failed to update user: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Are you sure you want to permanently delete user "${name}" and all their check-in records?`)) return;
    try {
      await apiAdmin.deleteUser(id);
      loadAdminData();
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  if (authLoading || (loading && !overview)) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Loading platform admin command center...</p>
      </div>
    );
  }

  const metrics = overview?.metrics || {};
  const distribution = overview?.distribution || {};
  const totalDist = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

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
            <span className="badge" style={{ backgroundColor: "#d97706", color: "#ffffff", padding: "2px 8px" }}>
              Panel 3
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-body)", paddingRight: "8px" }}>
              Platform Admin Command Center
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", marginBottom: "4px" }}>
            Operations & Global Oversight
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Global analytics, role assignment, triage audit logs, and Groq engine health.
          </p>
        </div>

        <button onClick={loadAdminData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "28px"
      }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Total User Accounts
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", marginTop: "4px" }}>
            {metrics.totalAccounts || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {metrics.totalUsers} Survivors • {metrics.totalDoctors} Clinicians
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Total Check-ins Logged
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", marginTop: "4px" }}>
            {metrics.totalCheckIns || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Evaluated deterministically
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Active Critical Cases
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "var(--error)", letterSpacing: "-0.03em", marginTop: "4px" }}>
            {metrics.activeCritical || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            In triage queue
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Platform Avg. Index
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "var(--status-stable)", letterSpacing: "-0.03em", marginTop: "4px" }}>
            {metrics.averageDhritiIndex || 0}
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>/100</span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Overall population score
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Groq AI Engine
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: overview?.system?.groqStatus === "ONLINE" ? "var(--status-stable)" : "#d97706", marginTop: "8px" }}>
            {overview?.system?.groqStatus || "ONLINE"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            openai/gpt-oss-20b
          </div>
        </div>
      </div>

      {/* Risk Distribution Visual Bar */}
      <div className="card" style={{ padding: "24px", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            Platform Distress Risk Distribution
          </h3>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {metrics.totalCheckIns} check-ins analyzed
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: "10px",
          width: "100%",
          backgroundColor: "var(--surface-strong)",
          borderRadius: "var(--rounded-pill)",
          overflow: "hidden",
          display: "flex",
          marginBottom: "14px"
        }}>
          <div style={{ width: `${(distribution.Stable / totalDist) * 100}%`, backgroundColor: "var(--status-stable)" }} title={`Stable: ${distribution.Stable}`} />
          <div style={{ width: `${(distribution.Mild / totalDist) * 100}%`, backgroundColor: "var(--status-mild)" }} title={`Mild: ${distribution.Mild}`} />
          <div style={{ width: `${(distribution.Elevated / totalDist) * 100}%`, backgroundColor: "var(--status-elevated)" }} title={`Elevated: ${distribution.Elevated}`} />
          <div style={{ width: `${(distribution.High / totalDist) * 100}%`, backgroundColor: "var(--status-high)" }} title={`High: ${distribution.High}`} />
          <div style={{ width: `${(distribution.Critical / totalDist) * 100}%`, backgroundColor: "var(--status-critical)" }} title={`Critical: ${distribution.Critical}`} />
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12px", color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-stable)" }} />
            Stable ({distribution.Stable || 0})
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-mild)" }} />
            Mild ({distribution.Mild || 0})
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-elevated)" }} />
            Elevated ({distribution.Elevated || 0})
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-high)" }} />
            High ({distribution.High || 0})
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-critical)" }} />
            Critical ({distribution.Critical || 0})
          </span>
        </div>
      </div>

      {/* Tabs Pill Group */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <div className="nav-pill-group">
          <button
            onClick={() => setActiveTab("overview")}
            className={`nav-pill-item ${activeTab === "overview" ? "active" : ""}`}
          >
            <Users size={14} style={{ display: "inline", marginRight: "4px" }} /> User Accounts ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab("checkins")}
            className={`nav-pill-item ${activeTab === "checkins" ? "active" : ""}`}
          >
            <Activity size={14} style={{ display: "inline", marginRight: "4px" }} /> Global Check-ins Feed ({checkInsList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: User Management */}
      {activeTab === "overview" && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
              User Directory & Role Control
            </h3>

            <div style={{ display: "flex", gap: "8px" }}>
              <select
                className="form-input"
                style={{ padding: "6px 12px", fontSize: "13px" }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="USER">Survivors (Users)</option>
                <option value="DOCTOR">Doctors / Helplines</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--hairline)", textAlign: "left", color: "var(--text-muted)" }}>
                  <th style={{ padding: "10px" }}>Name / Alias</th>
                  <th style={{ padding: "10px" }}>Email</th>
                  <th style={{ padding: "10px" }}>Role</th>
                  <th style={{ padding: "10px" }}>Affiliation</th>
                  <th style={{ padding: "10px" }}>Check-ins</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--hairline-soft)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 600, color: "var(--ink)" }}>
                      {u.name}
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-body)" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--rounded-pill)",
                        backgroundColor: u.role === "ADMIN" ? "rgba(245, 158, 11, 0.12)" : u.role === "DOCTOR" ? "rgba(59, 130, 246, 0.12)" : "var(--surface-card)",
                        color: u.role === "ADMIN" ? "#d97706" : u.role === "DOCTOR" ? "#2563eb" : "var(--text-body)"
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "12px" }}>
                      {u.organization || "—"}
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--ink)" }}>
                      {u.checkInCount || 0}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className={`badge ${u.status === "ACTIVE" ? "badge-stable" : "badge-critical"}`} style={{ fontSize: "10px" }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          onClick={() => handleEditUser(u)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Role & Permissions"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: "var(--error)" }}
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Global Check-ins Feed */}
      {activeTab === "checkins" && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
              Global Check-in Audit Stream
            </h3>

            <div style={{ display: "flex", gap: "8px" }}>
              <select
                className="form-input"
                style={{ padding: "6px 12px", fontSize: "13px" }}
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="ALL">All Risk Levels</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Elevated">Elevated</option>
                <option value="Mild">Mild</option>
                <option value="Stable">Stable</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--hairline)", textAlign: "left", color: "var(--text-muted)" }}>
                  <th style={{ padding: "10px" }}>User</th>
                  <th style={{ padding: "10px" }}>Timestamp</th>
                  <th style={{ padding: "10px" }}>Dhriti Index</th>
                  <th style={{ padding: "10px" }}>Risk Level</th>
                  <th style={{ padding: "10px" }}>Trend</th>
                  <th style={{ padding: "10px" }}>Safety Flag</th>
                  <th style={{ padding: "10px" }}>Triage Status</th>
                </tr>
              </thead>
              <tbody>
                {checkInsList.map((ci) => (
                  <tr key={ci.id} style={{ borderBottom: "1px solid var(--hairline-soft)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 600, color: "var(--ink)" }}>
                      {ci.userName}
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "12px" }}>
                      {new Date(ci.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--ink)", fontSize: "15px" }}>
                      {Math.round(ci.dhritiIndex)}/100
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className={`badge badge-${ci.riskLevel.toLowerCase()}`}>
                        {ci.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-body)" }}>
                      {ci.trend} ({ci.deltaPoints > 0 ? `+${ci.deltaPoints}` : ci.deltaPoints})
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      {ci.safetyConcern ? (
                        <span className="badge badge-critical">🚨 ALERT</span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Normal</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{ fontSize: "12px", color: ci.triageStatus === "RESOLVED" ? "var(--status-stable)" : "var(--text-muted)" }}>
                        {ci.triageStatus || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                Edit Role: {editingUser.name}
              </h3>
              <button onClick={() => setEditingUser(null)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">System Role</label>
              <select
                className="form-input"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="USER">USER — Standard Survivor Access</option>
                <option value="DOCTOR">DOCTOR — Clinical Distress Triage & Helpline Responder</option>
                <option value="ADMIN">ADMIN — Platform Operations & System Control</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Organization / Affiliation</label>
              <input
                type="text"
                className="form-input"
                value={editOrg}
                onChange={(e) => setEditOrg(e.target.value)}
                placeholder="e.g. Tele-MANAS Volunteer, NIMHANS, AASRA"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select
                className="form-input"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
              <button onClick={() => setEditingUser(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveUserRole} disabled={actionLoading} className="btn btn-primary">
                {actionLoading ? "Saving..." : "Save Changes"}
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
