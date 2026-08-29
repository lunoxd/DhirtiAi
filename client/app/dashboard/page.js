"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiDhriti, apiCheckIns, apiChat } from "../../lib/api";
import DhritiIndexGauge from "../../components/DhritiIndexGauge";
import CheckInCalendar from "../../components/CheckInCalendar";
import TrendChart from "../../components/TrendChart";
import DisclaimerBanner from "../../components/DisclaimerBanner";
import BreathingWidget from "../../components/BreathingWidget";
import { PlusCircle, ArrowRight, ShieldAlert, HeartHandshake, AlertCircle, Sparkles, Send, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [currentScore, setCurrentScore] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [allCheckIns, setAllCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inline Dashboard Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! I am DhritiAi. How are you feeling today? Ask me about stress relief, grounding, or sleep hygiene."
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [authLoading, isAuthenticated, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [currentRes, trendRes, historyRes] = await Promise.all([
        apiDhriti.getCurrent(),
        apiDhriti.getTrend(),
        apiCheckIns.getHistory()
      ]);

      setCurrentScore(currentRes);
      setTrendData(trendRes.trendPoints || []);
      setAllCheckIns(historyRes.checkIns || []);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendDashboardChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { role: "user", content: chatInput.trim() };
    const newMsgs = [...chatMessages, userMsg];
    setChatMessages(newMsgs);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await apiChat.sendMessage(newMsgs);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply }
      ]);
    } catch (err) {
      console.error("Dashboard Chat Error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I am here for you. Taking a slow deep breath in for 4 seconds can help bring calm. You can also reach Tele-MANAS anytime at 14416."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (authLoading || (loading && !currentScore)) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Loading your wellbeing dashboard...</p>
      </div>
    );
  }

  const hasData = currentScore && currentScore.hasCheckIns;

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Top Welcome Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
            Hello, {user?.name || "Friend"}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Welcome to your personal mental wellbeing overview.
          </p>
        </div>

        <Link href="/check-in" className="btn btn-primary btn-lg">
          <PlusCircle size={16} />
          <span>Start New Check-in</span>
        </Link>
      </div>

      {error && (
        <div style={{
          backgroundColor: "rgba(245, 36, 67, 0.18)",
          border: "1px solid var(--status-critical)",
          borderRadius: "var(--rounded-md)",
          padding: "12px 16px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--status-critical)",
          fontSize: "14px"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Safety Alert Flag */}
      {currentScore?.safetyConcern && (
        <div className="safety-banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 800, marginBottom: "4px" }}>
                We are here with you
              </h3>
              <p style={{ color: "var(--text-body)", fontSize: "13px" }}>
                Your recent check-in indicated safety or severe distress concerns. Trained professionals are available 24/7.
              </p>
            </div>
            <Link href="/support" className="btn btn-danger btn-sm">
              <ShieldAlert size={14} /> Immediate Helplines
            </Link>
          </div>
        </div>
      )}

      {/* ROW 1: SCORE (LEFT) + CALENDAR (RIGHT) IN A ROW */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
        marginBottom: "24px"
      }}>
        <DhritiIndexGauge
          score={currentScore?.dhritiIndex || 0}
          riskLevel={currentScore?.riskLevel || "STABLE"}
          delta={currentScore?.deltaPoints || 0}
          trend={currentScore?.trend || "STABLE"}
          safetyConcern={currentScore?.safetyConcern}
        />

        <CheckInCalendar checkIns={allCheckIns} />
      </div>

      {/* ROW 2: DHRITIAI CHATBOT INLINE SECTION */}
      <div className="card" style={{ marginBottom: "24px", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="/logo.png" alt="Dhriti Logo" style={{ height: "24px", width: "auto" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
              DhritiAi — Mental Health Assistant
            </h3>
          </div>
          <Link href="/chat" className="btn btn-secondary btn-sm">
            <MessageSquare size={13} /> Full Page Chat
          </Link>
        </div>

        {/* Chat History Container */}
        <div style={{
          backgroundColor: "#1e1f22",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--rounded-md)",
          padding: "14px",
          height: "180px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "12px"
        }}>
          {chatMessages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "13.5px",
                lineHeight: "1.45",
                backgroundColor: m.role === "user" ? "var(--primary)" : "#2b2d31",
                color: "#ffffff",
                border: m.role === "user" ? "none" : "1px solid var(--hairline)",
                whiteSpace: "pre-wrap"
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={12} color="var(--primary)" />
              <span>DhritiAi is typing...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, fontSize: "13.5px", backgroundColor: "#1e1f22", color: "#ffffff" }}
            placeholder="Ask DhritiAi anything about mental health or feelings..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendDashboardChat()}
          />
          <button
            onClick={handleSendDashboardChat}
            disabled={chatLoading || !chatInput.trim()}
            className="btn btn-primary btn-sm"
          >
            <Send size={14} /> Send
          </button>
        </div>
      </div>

      {/* ROW 3: OTHER DASHBOARD TOOLS (TREND, HISTORY, BREATHING, RECOMMENDATIONS) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
        marginBottom: "24px"
      }}>
        <TrendChart trendPoints={trendData} />

        <BreathingWidget />
      </div>

      {/* Supportive Recommendation Card */}
      {hasData && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <HeartHandshake size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                Supportive Recommendation
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: "1.5" }}>
                {currentScore.supportRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Check-ins List */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff" }}>RECENT CHECK-INS</h3>
          {allCheckIns.length > 0 && (
            <Link href="/history" style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {allCheckIns.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No recent records found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {allCheckIns.slice(0, 4).map((ci) => {
              const dateStr = new Date(ci.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              });
              return (
                <div
                  key={ci.id}
                  style={{
                    backgroundColor: "var(--surface-soft)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "var(--rounded-md)",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#ffffff" }}>{dateStr}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {ci.deltaPoints > 0 ? `↑ ${ci.deltaPoints} pts` : ci.deltaPoints < 0 ? `↓ ${Math.abs(ci.deltaPoints)} pts` : "Stable"}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff" }}>
                      {Math.round(ci.dhritiIndex)}
                    </span>
                    <span className={`badge badge-${ci.riskLevel.toLowerCase()}`}>
                      {ci.riskLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
