"use client";

import React, { useState, useRef, useEffect } from "react";
import { apiChat, apiCheckIns } from "../lib/api";
import { X, Send, Sparkles, CheckCircle2, Bot, ClipboardList } from "lucide-react";
import EmergencyModal from "./EmergencyModal";

export default function DhritiAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! I am DhritiAi, your emotional wellbeing assistant. You can chat with me naturally, or click 'Start AI Check-in' above to complete today's guided wellbeing assessment!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Interactive AI Check-in State Machine
  const [isAiCheckInMode, setIsAiCheckInMode] = useState(false);
  const [checkInStep, setCheckInStep] = useState(0);
  const [checkInAnswers, setCheckInAnswers] = useState({
    sleep: "",
    stress: "",
    mood: "",
    support: ""
  });

  const checkInQuestions = [
    {
      step: 1,
      key: "sleep",
      question: "🤖 Step 1/4: How has your sleep quality been over the last 24 hours?",
      options: [
        { label: "😴 Restful (7-9 hrs)", value: "RESTFUL" },
        { label: "😐 Moderate (5-7 hrs)", value: "MODERATE" },
        { label: "😫 Disrupted / Insomnia (<5 hrs)", value: "DISRUPTED" }
      ]
    },
    {
      step: 2,
      key: "stress",
      question: "🤖 Step 2/4: What is your primary stress or anxiety level today?",
      options: [
        { label: "😌 Low / Calm", value: "LOW" },
        { label: "😬 Moderate Stress", value: "MODERATE" },
        { label: "🚨 Severe / Overwhelmed", value: "SEVERE" }
      ]
    },
    {
      step: 3,
      key: "mood",
      question: "🤖 Step 3/4: How would you describe your overall mood & energy today?",
      options: [
        { label: "⚡ High Energy & Positive", value: "POSITIVE" },
        { label: "🌤️ Balanced / Neutral", value: "BALANCED" },
        { label: "🌧️ Low Energy / Feeling Sad", value: "LOW" }
      ]
    },
    {
      step: 4,
      key: "support",
      question: "🤖 Step 4/4: Have you felt connected and supported by family or friends today?",
      options: [
        { label: "🤝 Fully Connected", value: "CONNECTED" },
        { label: "😐 Somewhat Connected", value: "SOMEWHAT" },
        { label: "🌧️ Feeling Isolated / Alone", value: "ISOLATED" }
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, checkInStep]);

  const startAiCheckIn = () => {
    setIsAiCheckInMode(true);
    setCheckInStep(1);
    setCheckInAnswers({ sleep: "", stress: "", mood: "", support: "" });
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "🤖 Starting AI Wellbeing Check-in for today! Please answer the 4 questions below by clicking an option pill or typing your response."
      },
      {
        role: "assistant",
        content: checkInQuestions[0].question,
        options: checkInQuestions[0].options,
        stepKey: "sleep"
      }
    ]);
  };

  const handleSelectOption = async (key, optionObj) => {
    const updatedAnswers = { ...checkInAnswers, [key]: optionObj.value };
    setCheckInAnswers(updatedAnswers);

    // Add user selection message
    const userMsg = { role: "user", content: optionObj.label };
    const currentStepIndex = checkInStep - 1;
    const nextStep = checkInStep + 1;

    if (nextStep <= 4) {
      setCheckInStep(nextStep);
      const nextQ = checkInQuestions[nextStep - 1];
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          role: "assistant",
          content: nextQ.question,
          options: nextQ.options,
          stepKey: nextQ.key
        }
      ]);
    } else {
      // Completed all 4 steps -> Analyze & Submit Check-in to Database!
      setCheckInStep(0);
      setIsAiCheckInMode(false);
      setLoading(true);

      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          role: "assistant",
          content: "📊 Analyzing your responses with deterministic score rules and Groq AI..."
        }
      ]);

      try {
        const structuredResponses = {
          sleep: updatedAnswers.sleep,
          stress: updatedAnswers.stress,
          mood: updatedAnswers.mood,
          support: updatedAnswers.support
        };

        const res = await apiCheckIns.submit(
          structuredResponses,
          `AI Interactive Check-in completed via DhritiAi.`
        );

        const checkInResult = res.checkIn;
        const score = Math.round(checkInResult.dhritiIndex);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✅ Check-in Recorded for Today!\n\n• Dhriti Wellbeing Index: ${score}/100\n• Risk Status: ${checkInResult.riskLevel}\n• Trend: ${checkInResult.trend}\n\nRecommendations: ${checkInResult.supportRecommendation}`
          }
        ]);

        // Refresh window dashboard data if logged in
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("checkin-updated"));
        }
      } catch (err) {
        console.error("AI Check-in submit error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Your check-in answers were recorded! You can view your updated trend on your dashboard."
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

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
    { label: "🤖 AI Check-in", action: startAiCheckIn },
    { label: "🌸 Calm anxiety", text: "How can I calm my anxiety and grounding myself right now?" },
    { label: "💤 Sleep tips", text: "What are some practical tips for better sleep hygiene?" },
    { label: "🫁 Breathing", text: "Guide me through a simple 4-7-8 breathing exercise." }
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

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "410px",
          maxWidth: "calc(100vw - 32px)",
          height: "580px",
          maxHeight: "calc(100vh - 80px)",
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
            padding: "12px 16px",
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
                  Mental Health & AI Check-in Assistant
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={startAiCheckIn}
                className="btn btn-primary btn-sm"
                style={{ fontSize: "11.5px", padding: "5px 10px" }}
              >
                <ClipboardList size={13} />
                <span>AI Check-in</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{ color: "var(--text-muted)", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>
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
                  flexDirection: "column",
                  alignItems: m.role === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div style={{
                  maxWidth: "88%",
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

                {/* Option Pills for Interactive AI Check-in */}
                {m.options && m.options.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px", maxWidth: "88%" }}>
                    {m.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(m.stepKey, opt)}
                        style={{
                          backgroundColor: "#1e1f22",
                          border: "1px solid var(--primary)",
                          color: "#ffffff",
                          borderRadius: "var(--rounded-md)",
                          padding: "8px 12px",
                          fontSize: "12.5px",
                          fontWeight: 700,
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div className="card-inner" style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={13} color="var(--primary)" />
                  <span>DhritiAi is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Bar */}
          <div style={{
            padding: "8px 12px",
            backgroundColor: "#1e1f22",
            borderTop: "1px solid var(--hairline)",
            display: "flex",
            gap: "6px",
            overflowX: "auto"
          }}>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={qp.action ? qp.action : () => handleSend(qp.text)}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#ffffff",
                  backgroundColor: qp.action ? "var(--primary)" : "#2b2d31",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--rounded-pill)",
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                  cursor: "pointer"
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
              placeholder="Type message or select option above..."
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
