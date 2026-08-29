"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiCheckIns } from "../../lib/api";
import { ArrowLeft, ArrowRight, ShieldAlert, Sparkles, Check, Bot } from "lucide-react";
import EmergencyModal from "../../components/EmergencyModal";

const AI_10_QUESTIONS = [
  {
    id: "sleep",
    category: "Sleep Quality",
    question: "1. How has your sleep quality been over the last 24 hours?",
    options: [
      { key: "RESTFUL", label: "😴 Restful (7-9 hrs)" },
      { key: "MODERATE", label: "😐 Moderate (5-7 hrs)" },
      { key: "DISRUPTED", label: "😫 Disrupted / Insomnia (<5 hrs)" }
    ]
  },
  {
    id: "stress",
    category: "Stress & Anxiety",
    question: "2. What is your primary stress or anxiety level today?",
    options: [
      { key: "LOW", label: "😌 Low / Calm" },
      { key: "MODERATE", label: "😬 Moderate Stress" },
      { key: "SEVERE", label: "🚨 Severe / Overwhelmed" }
    ]
  },
  {
    id: "mood",
    category: "Mood & Emotional State",
    question: "3. How would you describe your overall mood & emotional state today?",
    options: [
      { key: "POSITIVE", label: "⚡ Positive / Uplifted" },
      { key: "NEUTRAL", label: "🌤️ Neutral / Okay" },
      { key: "LOW", label: "🌧️ Low / Feeling Sad" }
    ]
  },
  {
    id: "energy",
    category: "Energy & Vitality",
    question: "4. What is your physical & mental energy level right now?",
    options: [
      { key: "HIGH", label: "🔋 High Energy" },
      { key: "MODERATE", label: "🪫 Moderate Energy" },
      { key: "EXHAUSTED", label: "⚠️ Exhausted / Fatigue" }
    ]
  },
  {
    id: "support",
    category: "Social Connection",
    question: "5. Have you felt connected & supported by family or friends today?",
    options: [
      { key: "CONNECTED", label: "🤝 Fully Connected" },
      { key: "SOMEWHAT", label: "😐 Somewhat Connected" },
      { key: "ISOLATED", label: "🌧️ Feeling Isolated / Alone" }
    ]
  },
  {
    id: "focus",
    category: "Mental Focus",
    question: "6. How has your mental focus & concentration been today?",
    options: [
      { key: "CLEAR", label: "🎯 Clear & Focused" },
      { key: "DISTRACTED", label: "🤔 Slightly Distracted" },
      { key: "FOGGY", label: "🌫️ Brain Fog / Unfocused" }
    ]
  },
  {
    id: "appetite",
    category: "Appetite & Routine",
    question: "7. How has your appetite & meal schedule been today?",
    options: [
      { key: "REGULAR", label: "🥗 Regular & Healthy" },
      { key: "REDUCED", label: "🍎 Reduced / Skipped Meals" },
      { key: "IRREGULAR", label: "⚠️ Irregular / Loss of Appetite" }
    ]
  },
  {
    id: "safety",
    category: "Sense of Safety",
    isSafetyQuestion: true,
    question: "8. Do you feel safe, grounded, and secure right now?",
    options: [
      { key: "SAFE", label: "🛡️ Yes, I feel safe" },
      { key: "ANXIOUS", label: "😟 Anxious / Uneasy" },
      { key: "UNSAFE", label: "🚨 No, feeling unsafe" }
    ]
  },
  {
    id: "coping",
    category: "Coping Ability",
    question: "9. How confident do you feel in coping with today's challenges?",
    options: [
      { key: "STRONG", label: "💪 Strong & Confident" },
      { key: "STRUGGLING", label: "😬 Struggling a bit" },
      { key: "UNABLE", label: "🌧️ Unable to cope" }
    ]
  },
  {
    id: "outlook",
    category: "Future Outlook",
    question: "10. Looking ahead, how do you feel about tomorrow?",
    options: [
      { key: "OPTIMISTIC", label: "🌅 Optimistic & Hopeful" },
      { key: "UNCERTAIN", label: "🌤️ Uncertain / Cautious" },
      { key: "HOPELESS", label: "🌧️ Hopeless / Overwhelmed" }
    ]
  }
];

export default function CheckInPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const totalSteps = AI_10_QUESTIONS.length;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    let interval;
    if (submitting) {
      const messages = [
        "DhritiAi analyzing your 10 responses...",
        "Evaluating deterministic score rules",
        "Calculating Dhriti Index (0–100)",
        "Preparing today's wellbeing summary"
      ];
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % messages.length);
      }, 850);
    }
    return () => clearInterval(interval);
  }, [submitting]);

  const handleSelectOption = (questionId, optionKey) => {
    const nextAnswers = { ...answers, [questionId]: optionKey };
    setAnswers(nextAnswers);

    if (questionId === "safety" && optionKey === "UNSAFE") {
      setShowEmergencyModal(true);
    }

    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit(nextAnswers);
      }
    }, 180);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (finalAnswers = answers) => {
    setSubmitting(true);
    try {
      const res = await apiCheckIns.submit(
        finalAnswers,
        "AI 10-Question Wellbeing Assessment completed."
      );
      const checkInId = res.checkIn.id;
      router.push(`/check-in/result?id=${checkInId}`);
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err.message || "Failed to submit check-in. Please try again.");
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container-narrow" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading AI Check-in Assessment...</p>
      </div>
    );
  }

  // Loading Screen
  if (submitting) {
    const loadingMessages = [
      "DhritiAi analyzing your 10 responses...",
      "Evaluating deterministic score rules",
      "Calculating Dhriti Index (0–100)",
      "Preparing today's wellbeing summary"
    ];

    return (
      <div className="container-narrow" style={{ paddingTop: "80px", paddingBottom: "100px", textAlign: "center" }}>
        <div className="card" style={{ padding: "48px 24px", maxWidth: "480px", margin: "0 auto", backgroundColor: "#2b2d31" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--rounded-full)",
            border: "3px solid var(--hairline)",
            borderTopColor: "var(--primary)",
            margin: "0 auto 24px auto",
            animation: "spin 0.8s linear infinite"
          }} />

          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
            {loadingMessages[loadingMessageIndex]}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Processing your check-in securely via Groq AI & deterministic rules.
          </p>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const currentQ = AI_10_QUESTIONS[currentStep];

  return (
    <div className="container-narrow" style={{ paddingTop: "20px", paddingBottom: "60px" }}>
      {/* Navigation & Progress */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: currentStep === 0 ? "transparent" : "var(--text-muted)",
              fontSize: "13px",
              fontWeight: 700,
              cursor: currentStep === 0 ? "default" : "pointer"
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>
            🤖 AI Question {currentStep + 1} of 10
          </span>
        </div>

        {/* Progress Track */}
        <div style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#1e1f22",
          borderRadius: "var(--rounded-pill)",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
            backgroundColor: "var(--primary)",
            transition: "width 0.2s ease"
          }} />
        </div>
      </div>

      {/* 10-Question Card */}
      <div className="card" style={{ padding: "36px 28px", backgroundColor: "#2b2d31" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{
            padding: "4px 10px",
            backgroundColor: "#1e1f22",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--rounded-pill)",
            fontSize: "11px",
            fontWeight: 800,
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <Bot size={14} /> DHRITI AI WELLBEING ASSESSMENT
          </div>

          {currentQ.isSafetyQuestion && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "var(--rounded-pill)",
              backgroundColor: "rgba(245, 36, 67, 0.2)",
              color: "var(--status-critical)",
              fontSize: "11px",
              fontWeight: 800
            }}>
              <ShieldAlert size={14} /> SAFETY CHECK
            </div>
          )}
        </div>

        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 700 }}>
          {currentQ.category}
        </div>

        <h2 style={{
          fontSize: "clamp(22px, 4vw, 26px)",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          marginBottom: "24px",
          lineHeight: "1.3"
        }}>
          {currentQ.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {currentQ.options.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(currentQ.id, opt.key)}
                className={`option-button ${isSelected ? "selected" : ""}`}
                style={{
                  padding: "14px 18px",
                  fontSize: "15px",
                  backgroundColor: isSelected ? "var(--primary)" : "#1e1f22",
                  color: "#ffffff",
                  border: isSelected ? "1px solid var(--primary)" : "1px solid var(--hairline)"
                }}
              >
                <span style={{ fontWeight: isSelected ? 800 : 600 }}>{opt.label}</span>
                {isSelected && <Check size={18} color="#ffffff" />}
              </button>
            );
          })}
        </div>
      </div>

      {showEmergencyModal && (
        <EmergencyModal
          isCritical={true}
          onClose={() => setShowEmergencyModal(false)}
        />
      )}
    </div>
  );
}
