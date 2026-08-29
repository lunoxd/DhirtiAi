"use client";

import React, { useState, useRef, useEffect } from "react";
import { apiChat } from "../../lib/api";
import { Send, Sparkles, ShieldAlert } from "lucide-react";
import EmergencyModal from "../../components/EmergencyModal";

export default function DhritiAiPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! I am DhritiAi, your AI mental health and emotional wellbeing assistant. How are you feeling right now?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    const userMsg = { role: "user", content: prompt.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await apiChat.sendMessage(newMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply }
      ]);
    } catch (err) {
      console.error("DhritiAi Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I am here with you. Taking a slow deep breath in for 4 seconds and exhaling for 4 seconds can help bring calm. You can also reach Tele-MANAS anytime at 14416."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { label: "🌸 Grounding for Anxiety", text: "What are some quick grounding exercises to calm anxiety right now?" },
    { label: "💤 Better Sleep Tips", text: "How can I calm my mind before sleeping tonight?" },
    { label: "🫁 4-4-4 Breathing Guide", text: "Guide me through a simple 4-4-4 breathing session." },
    { label: "📞 24/7 Crisis Helplines", text: "Please list official Indian mental health helpline numbers." }
  ];

  return (
    <div style={{
      width: "100%",
      maxWidth: "920px",
      margin: "0 auto",
      height: "calc(100vh - 84px)",
      maxHeight: "calc(100vh - 84px)",
      overflow: "hidden",
      padding: "0 16px 16px 16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      {/* 1. Header Bar */}
      <div className="card" style={{ padding: "14px 20px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="Dhriti Logo" style={{ height: "36px", width: "auto" }} />
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>DhritiAi Assistant</span>
              <span className="badge badge-stable" style={{ fontSize: "11px", padding: "2px 8px" }}>Live AI</span>
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Mental Health & Emotional Wellbeing Companion
            </p>
          </div>
        </div>

        <button onClick={() => setShowEmergency(true)} className="btn btn-danger btn-sm" style={{ padding: "6px 12px", fontSize: "13px" }}>
          <ShieldAlert size={15} /> 24/7 Helplines
        </button>
      </div>

      {/* 2. Unscrollable Main Container with Internal Scroll Message List */}
      <div className="card" style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Message Bubble Feed */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          paddingRight: "6px",
          backgroundColor: "#2b2d31"
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div style={{
                maxWidth: "85%",
                padding: "14px 18px",
                borderRadius: "16px",
                fontSize: "16px",
                lineHeight: "1.6",
                fontWeight: 500,
                backgroundColor: m.role === "user" ? "var(--primary)" : "#1e1f22",
                color: "#ffffff",
                border: m.role === "user" ? "none" : "1px solid var(--hairline)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                whiteSpace: "pre-wrap"
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div className="card-inner" style={{ fontSize: "14px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} color="var(--primary)" />
                <span>DhritiAi is typing a thoughtful response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div style={{
          padding: "10px 0",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          borderTop: "1px solid var(--hairline)",
          marginTop: "10px"
        }}>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp.text)}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#ffffff",
                backgroundColor: "#1e1f22",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--rounded-pill)",
                padding: "6px 14px",
                whiteSpace: "nowrap"
              }}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, backgroundColor: "#1e1f22", color: "#ffffff", fontSize: "16px", padding: "12px 16px" }}
            placeholder="Type your message about mental health or feelings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn btn-primary btn-lg"
            style={{ padding: "12px 20px" }}
          >
            <Send size={18} /> Send
          </button>
        </div>
      </div>

      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </div>
  );
}
