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
  X,
  UserCheck,
  Stethoscope
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

  const handleApproveDoctor = async (id, name) => {
    try {
      await apiAdmin.approveDoctor(id);
      alert(`✓ Approved Doctor account for ${name}!`);
      loadAdminData();
    } catch (err) {
      alert("Failed to approve doctor: " + err.message);
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
            <span className="badge" style={{ backgroundColor: "var(--status-elevated)", color: "#111111", padding: "2px 8px", fontWeight: 800 }}>
              Panel 3
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", paddingRight: "8px" }}>
              Platform Admin Command Center
            </span>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "4px" }}>
            Operations & Global Oversight
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Global analytics, Doctor approval queue, role assignment, and Groq AI health.
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
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Total Accounts
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>
            {metrics.totalAccounts || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {metrics.totalUsers} Users • {metrics.totalDoctors} Doctors
          </div>
        </div>

        <div className="card" style={{ padding: "20px", border: metrics.pendingDoctors > 0 ? "1px solid var(--status-elevated)" : "1px solid var(--hairline)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Pending Doctor Approvals
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: metrics.pendingDoctors > 0 ? "var(--status-elevated)" : "#ffffff", marginTop: "4px" }}>
            {metrics.pendingDoctors || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Awaiting Admin review
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Total Check-ins Logged
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--primary)", marginTop: "4px" }}>
            {metrics.totalCheckIns || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Evaluated deterministically
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Active Critical Cases
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--status-critical)", marginTop: "4px" }}>
            {metrics.activeCritical || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            In triage queue
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Groq AI Engine
          </div>
          <div style={{ fontSize: "18px", fontWeight: 800, color: overview?.system?.groqStatus === "ONLINE" ? "var(--status-stable)" : "var(--status-elevated)", marginTop: "8px" }}>
            {overview?.system?.groqStatus || "ONLINE"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            qwen/qwen3.6-27b
          </div>
        </div>
      </div>

      {/* Tabs Pill Group */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <div className="nav-pill-group">
          <button
            onClick={() => setActiveTab("overview")}
            className={`nav-pill-item ${activeTab === "overview" ? "active" : ""}`}
          >
            <Users size={14} style={{ display: "inline", marginRight: "4px" }} /> User Directory ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab("checkins")}
            className={`nav-pill-item ${activeTab === "checkins" ? "active" : ""}`}
          >
            <Activity size={14} style={{ display: "inline", marginRight: "4px" }} /> Global Check-ins Feed ({checkInsList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: User Management & Doctor Approval */}
      {activeTab === "overview" && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
              User Directory & Doctor Approvals
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
                <option value="DOCTOR">Doctors / Responders</option>
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
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--hairline-soft)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 700, color: "#ffffff" }}>
                      {u.name}
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-body)" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "var(--rounded-pill)",
                        backgroundColor: u.role === "ADMIN" ? "rgba(240, 178, 50, 0.2)" : u.role === "DOCTOR" ? "rgba(88, 101, 242, 0.2)" : "var(--surface-soft)",
                        color: u.role === "ADMIN" ? "var(--status-elevated)" : u.role === "DOCTOR" ? "var(--primary)" : "var(--text-body)"
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "12px" }}>
                      {u.organization ? `${u.organization} (${u.specialization || 'Clinical'})` : "—"}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className={`badge ${u.status === "ACTIVE" ? "badge-stable" : u.status === "PENDING_APPROVAL" ? "badge-elevated" : "badge-critical"}`} style={{ fontSize: "10px" }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        {u.role === "DOCTOR" && u.status === "PENDING_APPROVAL" && (
                          <button
                            onClick={() => handleApproveDoctor(u.id, u.name)}
                            className="btn btn-success btn-sm"
                            title="Approve Doctor Account"
                          >
                            <UserCheck size={13} /> Approve Doctor
                          </button>
                        )}
                        <button
                          onClick={() => handleEditUser(u)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Role & Status"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: "var(--status-critical)" }}
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
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
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
                    <td style={{ padding: "12px 10px", fontWeight: 700, color: "#ffffff" }}>
                      {ci.userName}
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "12px" }}>
                      {new Date(ci.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: 800, color: "#ffffff", fontSize: "15px" }}>
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
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>
                Edit Role & Status: {editingUser.name}
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
                <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
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
