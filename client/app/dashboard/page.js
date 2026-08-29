"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiDhriti, apiCheckIns, apiChat } from "../../lib/api";
import DhritiIndexGauge from "../../components/DhritiIndexGauge";
import CheckInCalendar from "../../components/CheckInCalendar";
import TrendChart from "../../components/TrendChart";
import DisclaimerBanner from "../../components/DisclaimerBanner";
import { PlusCircle, ShieldAlert, AlertCircle, Sparkles, Send, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [currentScore, setCurrentScore] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [allCheckIns, setAllCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inline Dashboard AI Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! I am DhritiAi. How can I support your mental health or feelings right now?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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

  const handleSendChat = async (textToSend) => {
    const prompt = textToSend || chatInput;
    if (!prompt.trim() || chatLoading) return;

    const userMsg = { role: "user", content: prompt.trim() };
    const newMsgs = [...chatMessages, userMsg];
    setChatMessages(newMsgs);
    if (!textToSend) setChatInput("");
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
          content: "I am here with you. Taking 3 slow deep breaths can help bring calm. You can also reach Tele-MANAS anytime at 14416."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const quickPrompts = [
    { label: "🌸 Calm anxiety", text: "How can I calm anxiety right now?" },
    { label: "💤 Sleep tips", text: "Tips for better sleep tonight" },
    { label: "📞 24/7 Helplines", text: "Show emergency helplines" }
  ];

  if (authLoading || (loading && !currentScore)) {
    return (
      <div style={{ width: "100%", height: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Loading full-width dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      height: "calc(100vh - 84px)",
      maxHeight: "calc(100vh - 84px)",
      overflow: "hidden",
      padding: "0 24px 16px 24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      {/* 1. Header Control Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        marginBottom: "10px"
      }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "2px" }}>
            Welcome, {user?.name || "Friend"}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Full-screen personal wellbeing monitoring dashboard
          </p>
        </div>

        <Link href="/check-in" className="btn btn-primary btn-sm" style={{ padding: "8px 16px" }}>
          <PlusCircle size={15} />
          <span>New Check-in</span>
        </Link>
      </div>

      {error && (
        <div style={{
          backgroundColor: "rgba(245, 36, 67, 0.18)",
          border: "1px solid var(--status-critical)",
          borderRadius: "var(--rounded-md)",
          padding: "8px 12px",
          marginBottom: "10px",
          color: "var(--status-critical)",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Safety Alert Flag */}
      {currentScore?.safetyConcern && (
        <div className="safety-banner" style={{ padding: "10px 14px", marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700 }}>
              ⚠️ Severe distress flagged. 24/7 human crisis counselors are available.
            </span>
            <Link href="/support" className="btn btn-danger btn-sm" style={{ padding: "4px 10px", fontSize: "12px" }}>
              <ShieldAlert size={13} /> 24/7 Helplines
            </Link>
          </div>
        </div>
      )}

      {/* 2. Main Full-Width Grid Row: 3 Panels Across Screen */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1.2fr 1.1fr",
        gap: "16px",
        flex: 1,
        maxHeight: "calc(100vh - 200px)",
        alignItems: "stretch"
      }}>
        {/* Column 1 (Left): Score Display + Historical Dhriti Trend Graph */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
          <DhritiIndexGauge
            score={currentScore?.dhritiIndex || 0}
            riskLevel={currentScore?.riskLevel || "STABLE"}
            delta={currentScore?.deltaPoints || 0}
            trend={currentScore?.trend || "STABLE"}
            safetyConcern={currentScore?.safetyConcern}
          />
          <div style={{ flex: 1 }}>
            <TrendChart trendPoints={trendData} />
          </div>
        </div>

        {/* Column 2 (Middle): Check-in Monthly Calendar Grid */}
        <div style={{ height: "100%" }}>
          <CheckInCalendar checkIns={allCheckIns} />
        </div>

        {/* Column 3 (Right): DHRITIAI CHATBOT IN PLACE OF BOX BREATHING */}
        <div className="card" style={{ padding: "16px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logo.png" alt="Dhriti Logo" style={{ height: "24px", width: "auto" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff" }}>
                DhritiAi Assistant
              </h3>
            </div>
            <span className="badge badge-stable" style={{ fontSize: "10px" }}>Live AI</span>
          </div>

          {/* Messages Feed */}
          <div style={{
            flex: 1,
            backgroundColor: "#1e1f22",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--rounded-md)",
            padding: "12px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "10px"
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
                  maxWidth: "88%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  fontWeight: 500,
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
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginBottom: "8px" }}>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendChat(qp.text)}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#ffffff",
                  backgroundColor: "#1e1f22",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--rounded-pill)",
                  padding: "4px 8px",
                  whiteSpace: "nowrap"
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, fontSize: "13.5px", backgroundColor: "#1e1f22", color: "#ffffff" }}
              placeholder="Ask DhritiAi about mental health..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            />
            <button
              onClick={() => handleSendChat()}
              disabled={chatLoading || !chatInput.trim()}
              className="btn btn-primary btn-sm"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Control Row */}
      <div className="card" style={{ padding: "10px 16px", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>RECENT RECORD:</span>
          {allCheckIns.length > 0 ? (
            <span style={{ fontSize: "13px", color: "var(--text-body)" }}>
              {new Date(allCheckIns[0].createdAt).toLocaleDateString()} — Score: <strong>{Math.round(allCheckIns[0].dhritiIndex)}/100</strong> ({allCheckIns[0].riskLevel})
            </span>
          ) : (
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>No check-in history available.</span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/history" style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>Full History</span>
            <ArrowRight size={13} />
          </Link>
          <span style={{ color: "var(--hairline)" }}>|</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Non-Diagnostic Wellbeing Tool
          </span>
        </div>
      </div>
    </div>
  );
}
