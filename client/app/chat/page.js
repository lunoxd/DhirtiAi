"use client";

import React, { useState, useRef, useEffect } from "react";
import { apiChat } from "../../lib/api";
import { Send, Sparkles, Heart, ShieldAlert, Bot } from "lucide-react";
import EmergencyModal from "../../components/EmergencyModal";

export default function DhritiAiPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! I am DhritiAi, your AI mental health and emotional wellbeing assistant. How are you feeling today? You can share your thoughts, ask about grounding techniques, or talk about stress relief."
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
          content: "I am here with you. If you are feeling overwhelmed, taking a slow deep breath in for 4 seconds and exhaling for 4 seconds can help bring calm. You can also reach Tele-MANAS anytime at 14416."
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
    { label: "🌸 Grounding for Anxiety", text: "What are some grounding exercises to reduce panic or anxiety right now?" },
    { label: "💤 Improving Sleep Quality", text: "How can I calm my mind before sleeping tonight?" },
    { label: "🫁 4-7-8 Breathing Guide", text: "Can you guide me through a 4-7-8 breathing session?" },
    { label: "📞 24/7 Crisis Helplines", text: "Please list official Indian mental health helpline numbers." }
  ];

  return (
    <div className="container-narrow" style={{ paddingTop: "12px", paddingBottom: "40px" }}>
      {/* Page Header */}
      <div className="card" style={{ padding: "20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="Dhriti Logo" style={{ height: "32px", width: "auto" }} />
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>DhritiAi</span>
              <span className="badge badge-stable" style={{ fontSize: "10px", padding: "2px 8px" }}>Live AI</span>
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Mental Health & Emotional Wellbeing Assistant
            </p>
          </div>
        </div>

        <button onClick={() => setShowEmergency(true)} className="btn btn-danger btn-sm">
          <ShieldAlert size={14} /> Helplines
        </button>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="card" style={{ padding: "20px", height: "520px", display: "flex", flexDirection: "column" }}>
        <div style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          paddingRight: "4px"
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
                padding: "12px 16px",
                borderRadius: "14px",
                fontSize: "14px",
                lineHeight: "1.55",
                backgroundColor: m.role === "user" ? "var(--primary)" : "var(--surface-soft)",
                color: m.role === "user" ? "#ffffff" : "var(--ink)",
                border: m.role === "user" ? "none" : "1px solid var(--hairline)",
                whiteSpace: "pre-wrap"
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div className="card-inner" style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={14} color="var(--primary)" />
                <span>DhritiAi is typing a thoughtful response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{
          padding: "10px 0",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          borderTop: "1px solid var(--hairline)",
          marginTop: "12px"
        }}>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp.text)}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--ink)",
                backgroundColor: "var(--surface-soft)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--rounded-pill)",
                padding: "6px 12px",
                whiteSpace: "nowrap"
              }}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Type your message about mental health or feelings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn btn-primary"
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>

      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </div>
  );
}
