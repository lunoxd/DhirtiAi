"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiAdmin } from "../../lib/api";
import {
  ShieldCheck,
  Users,
  Activity,
  AlertTriangle,
  Server,
  Cpu,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  RefreshCw,
  X,
  Stethoscope,
  UserCheck
} from "lucide-react";
import DisclaimerBanner from "../../components/DisclaimerBanner";

export default function AdminPortalPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "users" | "checkins" | "system"
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

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await apiAdmin.getUsers(roleFilter, searchQuery);
      setUsersList(res.users || []);
    } catch (err) {
      console.error(err);
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
        <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Loading platform admin command center...</p>
      </div>
    );
  }

  const metrics = overview?.metrics || {};
  const distribution = overview?.distribution || {};
  const totalDist = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Top Header */}
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
            backgroundColor: "rgba(240, 178, 50, 0.18)",
            color: "var(--status-elevated)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 800,
            marginBottom: "8px"
          }}>
            <ShieldCheck size={14} />
            <span>PANEL 3 — PLATFORM ADMIN COMMAND CENTER</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
            DHRITI Operations & Control
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Global analytics, multi-role user management, scoring audit feed, and system health.
          </p>
        </div>

        <button onClick={loadAdminData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* KPI Metrics Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
        marginBottom: "28px"
      }}>
        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Total User Accounts
          </div>
          <div style={{ fontSize: "30px", fontWeight: 900, color: "#ffffff", marginTop: "4px" }}>
            {metrics.totalAccounts || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {metrics.totalUsers} Survivors • {metrics.totalDoctors} Clinicians
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Total Check-ins Logged
          </div>
          <div style={{ fontSize: "30px", fontWeight: 900, color: "var(--brand-primary)", marginTop: "4px" }}>
            {metrics.totalCheckIns || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Evaluated deterministically
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Active Critical Cases
          </div>
          <div style={{ fontSize: "30px", fontWeight: 900, color: "var(--status-critical)", marginTop: "4px" }}>
            {metrics.activeCritical || 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            In triage queue
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Platform Avg. Index
          </div>
          <div style={{ fontSize: "30px", fontWeight: 900, color: "var(--status-mild)", marginTop: "4px" }}>
            {metrics.averageDhritiIndex || 0}
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>/100</span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Overall population indicator
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Groq AI Engine
          </div>
          <div style={{ fontSize: "20px", fontWeight: 900, color: overview?.system?.groqStatus === "ONLINE" ? "var(--status-stable)" : "var(--status-elevated)", marginTop: "8px" }}>
            {overview?.system?.groqStatus || "ONLINE"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            openai/gpt-oss-20b
          </div>
        </div>
      </div>

      {/* Risk Distribution Visual Bar */}
      <div className="card" style={{ padding: "20px", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
            Platform Distress Risk Distribution
          </h3>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {metrics.totalCheckIns} check-ins analyzed
          </span>
        </div>

        {/* Progress distribution bar */}
        <div style={{
          height: "14px",
          width: "100%",
          backgroundColor: "var(--bg-tertiary)",
          borderRadius: "7px",
          overflow: "hidden",
          display: "flex",
          marginBottom: "12px"
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

      {/* Tabs Switcher */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("overview")}
          className={`btn btn-sm ${activeTab === "overview" ? "btn-primary" : "btn-secondary"}`}
        >
          <Users size={14} /> User Accounts ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab("checkins")}
          className={`btn btn-sm ${activeTab === "checkins" ? "btn-primary" : "btn-secondary"}`}
        >
          <Activity size={14} /> Global Check-ins Feed ({checkInsList.length})
        </button>
      </div>

      {/* TAB 1: User Management */}
      {activeTab === "overview" && (
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
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
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--text-muted)" }}>
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
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border-card)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 600, color: "#ffffff" }}>
                      {u.name}
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-normal)" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: u.role === "ADMIN" ? "rgba(240, 178, 50, 0.2)" : u.role === "DOCTOR" ? "rgba(88, 101, 242, 0.2)" : "rgba(255, 255, 255, 0.08)",
                        color: u.role === "ADMIN" ? "var(--status-elevated)" : u.role === "DOCTOR" ? "var(--brand-primary)" : "var(--text-normal)"
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "12px" }}>
                      {u.organization || "—"}
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: 700, color: "#ffffff" }}>
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
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
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
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left", color: "var(--text-muted)" }}>
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
                  <tr key={ci.id} style={{ borderBottom: "1px solid var(--border-card)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 600, color: "#ffffff" }}>
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
                    <td style={{ padding: "12px 10px", color: "var(--text-normal)" }}>
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
                Edit Role & Permissions: {editingUser.name}
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
