"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiCheckIns } from "../../lib/api";
import { ArrowLeft, ArrowRight, ShieldAlert, Sparkles, Check } from "lucide-react";
import EmergencyModal from "../../components/EmergencyModal";

const STRUCTURED_QUESTIONS = [
  {
    id: "mood",
    category: "Mood",
    question: "How are you feeling emotionally today?",
    options: [
      { key: "very_good", label: "Very Good" },
      { key: "good", label: "Good" },
      { key: "okay", label: "Okay" },
      { key: "difficult", label: "Difficult" },
      { key: "very_difficult", label: "Very Difficult" }
    ]
  },
  {
    id: "stress",
    category: "Stress Level",
    question: "How stressed have you felt recently?",
    options: [
      { key: "not_at_all", label: "Not at all" },
      { key: "a_little", label: "A little" },
      { key: "somewhat", label: "Somewhat" },
      { key: "very_stressed", label: "Very stressed" },
      { key: "extremely_stressed", label: "Extremely stressed" }
    ]
  },
  {
    id: "sleep",
    category: "Sleep Quality",
    question: "How has your sleep been recently?",
    options: [
      { key: "very_good", label: "Very good" },
      { key: "good", label: "Good" },
      { key: "okay", label: "Okay" },
      { key: "poor", label: "Poor" },
      { key: "very_poor", label: "Very poor" }
    ]
  },
  {
    id: "daily_functioning",
    category: "Daily Functioning",
    question: "How manageable have routine daily tasks felt?",
    options: [
      { key: "very_easy", label: "Very manageable" },
      { key: "manageable", label: "Manageable" },
      { key: "somewhat_difficult", label: "Somewhat difficult" },
      { key: "hard_to_manage", label: "Hard to manage" },
      { key: "unable_to_function", label: "Unable to function" }
    ]
  },
  {
    id: "social_connection",
    category: "Social Connection",
    question: "How connected have you felt with people you trust?",
    options: [
      { key: "very_connected", label: "Very connected" },
      { key: "moderately_connected", label: "Connected" },
      { key: "somewhat_isolated", label: "Somewhat isolated" },
      { key: "very_isolated", label: "Very isolated" },
      { key: "completely_isolated", label: "Completely isolated" }
    ]
  },
  {
    id: "intrusive_thoughts",
    category: "Intrusive Thoughts",
    question: "How often have upsetting thoughts or memories been bothering you?",
    options: [
      { key: "never", label: "Never" },
      { key: "rarely", label: "Rarely" },
      { key: "sometimes", label: "Sometimes" },
      { key: "often", label: "Often" },
      { key: "very_often", label: "Very often" }
    ]
  },
  {
    id: "emotional_control",
    category: "Emotional Regulation",
    question: "How overwhelmed have your emotions felt lately?",
    options: [
      { key: "in_control", label: "In control" },
      { key: "mostly_calm", label: "Mostly calm" },
      { key: "occasionally_overwhelmed", label: "Occasionally overwhelmed" },
      { key: "frequently_overwhelmed", label: "Frequently overwhelmed" },
      { key: "constantly_overwhelmed", label: "Constantly overwhelmed" }
    ]
  },
  {
    id: "coping_ability",
    category: "Coping Ability",
    question: "How confident do you feel in your ability to cope right now?",
    options: [
      { key: "very_confident", label: "Very confident" },
      { key: "confident", label: "Confident" },
      { key: "unsure", label: "Unsure" },
      { key: "struggling", label: "Struggling" },
      { key: "unable_to_cope", label: "Unable to cope" }
    ]
  },
  {
    id: "sense_of_safety",
    category: "Sense of Safety",
    isSafetyQuestion: true,
    question: "Do you feel safe right now?",
    options: [
      { key: "yes", label: "Yes, I feel safe" },
      { key: "unsure", label: "Unsure / Uneasy" },
      { key: "no", label: "No, I do not feel safe" }
    ]
  },
  {
    id: "overall_wellbeing",
    category: "Overall Wellbeing",
    question: "Overall, how would you describe your emotional state today?",
    options: [
      { key: "very_positive", label: "Very positive" },
      { key: "positive", label: "Positive" },
      { key: "fair", label: "Fair" },
      { key: "low", label: "Low" },
      { key: "very_low", label: "Very low" }
    ]
  }
];

const WRITTEN_QUESTIONS = [
  {
    id: "general_reflection",
    title: "Optional Reflection",
    question: "Is there anything bothering you or on your mind that you would like to note down?",
    placeholder: "Write anything you'd like us to know (optional, skip anytime)..."
  },
  {
    id: "support_needs",
    title: "Support Thoughts (Optional)",
    question: "Is there any specific support, comfort, or routine that might help you today?",
    placeholder: "e.g. Taking a walk, resting, talking to a counselor, breathing exercises..."
  }
];

export default function CheckInPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [writtenAnswers, setWrittenAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const totalSteps = STRUCTURED_QUESTIONS.length + WRITTEN_QUESTIONS.length;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    let interval;
    if (submitting) {
      const messages = [
        "Analyzing your check-in...",
        "Understanding your responses",
        "Looking at recent changes",
        "Preparing your wellbeing summary"
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

    if (questionId === "sense_of_safety" && optionKey === "no") {
      setShowEmergencyModal(true);
    }

    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 180);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkipWritten = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await apiCheckIns.submit(answers, writtenAnswers);
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
        <p style={{ color: "var(--text-muted)" }}>Preparing check-in...</p>
      </div>
    );
  }

  // Loading Screen
  if (submitting) {
    const loadingMessages = [
      "Analyzing your check-in...",
      "Understanding your responses",
      "Looking at recent changes",
      "Preparing your wellbeing summary"
    ];

    return (
      <div className="container-narrow" style={{ paddingTop: "80px", paddingBottom: "100px", textAlign: "center" }}>
        <div className="card" style={{ padding: "48px 24px", maxWidth: "480px", margin: "0 auto" }}>
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
            Processing your check-in securely and deterministically.
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

  const isStructuredStep = currentStep < STRUCTURED_QUESTIONS.length;
  const currentStructuredQ = isStructuredStep ? STRUCTURED_QUESTIONS[currentStep] : null;
  const currentWrittenQ = !isStructuredStep ? WRITTEN_QUESTIONS[currentStep - STRUCTURED_QUESTIONS.length] : null;

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

          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>
            Question {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* Hairline Progress Track */}
        <div style={{
          width: "100%",
          height: "6px",
          backgroundColor: "var(--surface-soft)",
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

      {/* Structured Question Card */}
      {isStructuredStep && currentStructuredQ && (
        <div className="card" style={{ padding: "36px 28px" }}>
          {currentStructuredQ.isSafetyQuestion && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "var(--rounded-pill)",
              backgroundColor: "rgba(242, 63, 67, 0.18)",
              color: "var(--status-critical)",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "16px"
            }}>
              <ShieldAlert size={14} />
              <span>SAFETY CHECK</span>
            </div>
          )}

          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 700 }}>
            {currentStructuredQ.category}
          </div>

          <h2 style={{
            fontSize: "clamp(22px, 4vw, 26px)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: "28px",
            lineHeight: "1.3"
          }}>
            {currentStructuredQ.question}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentStructuredQ.options.map((opt) => {
              const isSelected = answers[currentStructuredQ.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(currentStructuredQ.id, opt.key)}
                  className={`option-button ${isSelected ? "selected" : ""}`}
                >
                  <span style={{ fontWeight: isSelected ? 700 : 500 }}>{opt.label}</span>
                  {isSelected && <Check size={18} color="#ffffff" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Written Reflection Card */}
      {!isStructuredStep && currentWrittenQ && (
        <div className="card" style={{ padding: "36px 28px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "var(--rounded-pill)",
            backgroundColor: "var(--surface-soft)",
            color: "var(--primary)",
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "16px"
          }}>
            <Sparkles size={14} />
            <span>{currentWrittenQ.title}</span>
          </div>

          <h2 style={{
            fontSize: "clamp(20px, 3.5vw, 24px)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
            lineHeight: "1.3"
          }}>
            {currentWrittenQ.question}
          </h2>

          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
            You can write as little or as much as you like, or skip this entirely.
          </p>

          <textarea
            className="form-textarea"
            placeholder={currentWrittenQ.placeholder}
            value={writtenAnswers[currentWrittenQ.id] || ""}
            onChange={(e) =>
              setWrittenAnswers({ ...writtenAnswers, [currentWrittenQ.id]: e.target.value })
            }
            style={{ width: "100%", minHeight: "130px", marginBottom: "24px" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleSkipWritten}
              className="btn btn-secondary"
            >
              Skip Question
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              <span>{currentStep === totalSteps - 1 ? "Complete Check-in" : "Continue"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {showEmergencyModal && (
        <EmergencyModal
          isCritical={true}
          onClose={() => setShowEmergencyModal(false)}
        />
      )}
    </div>
  );
}
