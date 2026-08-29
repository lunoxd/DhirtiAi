"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiDhriti, apiCheckIns, apiChat } from "../../lib/api";
import DhritiIndexGauge from "../../components/DhritiIndexGauge";
import CheckInCalendar from "../../components/CheckInCalendar";
import TrendChart from "../../components/TrendChart";
import { PlusCircle, ShieldAlert, AlertCircle, Sparkles, Send } from "lucide-react";

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

  // LOCK BODY SCROLL FOR FIXED 100% UNFLINCHING UN-SCROLLABLE DASHBOARD VIEWPORT
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

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
      width: "100vw",
      height: "calc(100vh - 60px)",
      maxHeight: "calc(100vh - 60px)",
      overflow: "hidden",
      padding: "12px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box"
    }}>
      {/* 1. Header Control Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        marginBottom: "8px"
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
            Welcome, {user?.name || "Friend"}
          </h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
            Full-screen personal wellbeing monitoring dashboard
          </p>
        </div>

        <Link href="/check-in" className="btn btn-primary btn-sm" style={{ padding: "6px 14px" }}>
          <PlusCircle size={15} />
          <span>New Check-in</span>
        </Link>
      </div>

      {error && (
        <div style={{
          backgroundColor: "rgba(245, 36, 67, 0.18)",
          border: "1px solid var(--status-critical)",
          borderRadius: "var(--rounded-md)",
          padding: "6px 12px",
          marginBottom: "8px",
          color: "var(--status-critical)",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Safety Alert Flag */}
      {currentScore?.safetyConcern && (
        <div className="safety-banner" style={{ padding: "8px 12px", marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700 }}>
              ⚠️ Severe distress flagged. 24/7 human crisis counselors are available.
            </span>
            <Link href="/support" className="btn btn-danger btn-sm" style={{ padding: "4px 8px", fontSize: "11px" }}>
              <ShieldAlert size={13} /> Helplines
            </Link>
          </div>
        </div>
      )}

      {/* 2. Main Full-Width Grid Row: 3 Panels Across Screen */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1.2fr 1.1fr",
        gap: "14px",
        flex: 1,
        maxHeight: "calc(100vh - 120px)",
        alignItems: "stretch",
        overflow: "hidden"
      }}>
        {/* Column 1 (Left): Score Display + Historical Dhriti Trend Graph */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", overflow: "hidden" }}>
          <DhritiIndexGauge
            score={currentScore?.dhritiIndex || 0}
            riskLevel={currentScore?.riskLevel || "STABLE"}
            delta={currentScore?.deltaPoints || 0}
            trend={currentScore?.trend || "STABLE"}
            safetyConcern={currentScore?.safetyConcern}
          />
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TrendChart trendPoints={trendData} />
          </div>
        </div>

        {/* Column 2 (Middle): Check-in Monthly Calendar Grid */}
        <div style={{ height: "100%", overflow: "hidden" }}>
          <CheckInCalendar checkIns={allCheckIns} />
        </div>

        {/* Column 3 (Right): DHRITIAI CHATBOT */}
        <div className="card" style={{ padding: "14px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logo.png" alt="Dhriti Logo" style={{ height: "22px", width: "auto" }} />
              <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>
                DhritiAi Assistant
              </h3>
            </div>
            <span className="badge badge-stable" style={{ fontSize: "10px", padding: "1px 6px" }}>Groq AI</span>
          </div>

          {/* Messages Feed */}
          <div style={{
            flex: 1,
            backgroundColor: "#1e1f22",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--rounded-md)",
            padding: "10px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "8px"
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
                  maxWidth: "90%",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  lineHeight: "1.45",
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
              <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={12} color="var(--primary)" />
                <span>DhritiAi is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div style={{ display: "flex", gap: "4px", overflowX: "auto", marginBottom: "6px" }}>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendChat(qp.text)}
                style={{
                  fontSize: "10.5px",
                  fontWeight: 600,
                  color: "#ffffff",
                  backgroundColor: "#1e1f22",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--rounded-pill)",
                  padding: "3px 8px",
                  whiteSpace: "nowrap"
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, fontSize: "13px", backgroundColor: "#1e1f22", color: "#ffffff", padding: "6px 10px" }}
              placeholder="Ask DhritiAi..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            />
            <button
              onClick={() => handleSendChat()}
              disabled={chatLoading || !chatInput.trim()}
              className="btn btn-primary btn-sm"
              style={{ padding: "6px 10px" }}
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
