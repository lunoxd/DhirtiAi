"use client";

import React, { useState, useRef, useEffect } from "react";
import { apiChat } from "../lib/api";
import { X, Send, Sparkles } from "lucide-react";
import EmergencyModal from "./EmergencyModal";

export default function DhritiAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! I am DhritiAi, your mental health and emotional wellbeing companion. How are you feeling today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
      console.error("Chat error:", err);
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
    { label: "🌸 Calm anxiety", text: "How can I calm my anxiety and grounding myself right now?" },
    { label: "💤 Better sleep tips", text: "What are some practical tips for better sleep hygiene?" },
    { label: "🫁 4-7-8 breathing", text: "Guide me through a simple 4-7-8 breathing exercise." },
    { label: "📞 24/7 Helplines", text: "Show me emergency helpline contacts." }
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 999,
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            borderRadius: "var(--rounded-pill)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 24px rgba(245, 36, 67, 0.4)",
            border: "none",
            fontWeight: 700,
            fontSize: "14px"
          }}
        >
          <div style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Sparkles size={14} color="#ffffff" />
          </div>
          <span>Chat with DhritiAi</span>
        </button>
      )}

      {/* Floating Chat Window Drawer */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "385px",
          maxWidth: "calc(100vw - 32px)",
          height: "540px",
          maxHeight: "calc(100vh - 100px)",
          backgroundColor: "#2b2d31",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--rounded-xl)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Drawer Header */}
          <div style={{
            backgroundColor: "#1e1f22",
            borderBottom: "1px solid var(--hairline)",
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/logo.png" alt="Dhriti Logo" style={{ height: "26px", width: "auto" }} />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>DhritiAi</span>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-stable)" }} />
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                  Mental Health & Wellbeing Assistant
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                color: "var(--text-muted)",
                padding: "4px",
                borderRadius: "var(--rounded-sm)"
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div style={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
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
                  padding: "10px 14px",
                  borderRadius: "14px",
                  fontSize: "13.5px",
                  lineHeight: "1.5",
                  backgroundColor: m.role === "user" ? "var(--primary)" : "#1e1f22",
                  color: "#ffffff",
                  border: m.role === "user" ? "none" : "1px solid var(--hairline)",
                  whiteSpace: "pre-wrap"
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div className="card-inner" style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={13} color="var(--primary)" />
                  <span>DhritiAi is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div style={{
            padding: "8px 12px",
            backgroundColor: "#1e1f22",
            borderTop: "1px solid var(--hairline)",
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            scrollbarWidth: "none"
          }}>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.text)}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#ffffff",
                  backgroundColor: "#2b2d31",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--rounded-pill)",
                  padding: "4px 10px",
                  whiteSpace: "nowrap"
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{
            padding: "12px 14px",
            backgroundColor: "#1e1f22",
            borderTop: "1px solid var(--hairline)",
            display: "flex",
            gap: "8px",
            alignItems: "center"
          }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, padding: "8px 12px", fontSize: "13.5px" }}
              placeholder="Ask DhritiAi about mental health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="btn btn-primary btn-sm"
              style={{ padding: "8px 12px" }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {showEmergencyModal && (
        <EmergencyModal onClose={() => setShowEmergencyModal(false)} />
      )}
    </>
  );
}
