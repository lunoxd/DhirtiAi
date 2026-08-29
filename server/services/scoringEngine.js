/**
 * DHRITI Deterministic Scoring & Risk Engine
 * Calculates deterministic 0-100 Dhriti Index, detects trends, and enforces safety overrides.
 */

// Centralized Question Scoring Matrix with support for both legacy and 10-Q AI Assessment keys
const QUESTION_SCORING_MATRIX = {
  mood: {
    label: "Mood",
    options: {
      very_good: 0, POSITIVE: 0,
      good: 1, BALANCED: 1, NEUTRAL: 2,
      okay: 2,
      difficult: 4, LOW: 4,
      very_difficult: 5
    }
  },
  stress: {
    label: "Stress Level",
    options: {
      not_at_all: 0, LOW: 0,
      a_little: 1,
      somewhat: 2, MODERATE: 2,
      very_stressed: 4, SEVERE: 5,
      extremely_stressed: 5
    }
  },
  sleep: {
    label: "Sleep Quality",
    options: {
      very_good: 0, RESTFUL: 0,
      good: 1,
      okay: 2, MODERATE: 2,
      poor: 4, DISRUPTED: 4,
      very_poor: 5
    }
  },
  energy: {
    label: "Energy & Vitality",
    options: {
      HIGH: 0,
      MODERATE: 2,
      EXHAUSTED: 5
    }
  },
  social_connection: {
    label: "Social Connection",
    options: {
      very_connected: 0, CONNECTED: 0,
      moderately_connected: 1, SOMEWHAT: 2,
      somewhat_isolated: 2,
      very_isolated: 4, ISOLATED: 4,
      completely_isolated: 5
    }
  },
  support: {
    label: "Social Support",
    options: {
      CONNECTED: 0,
      SOMEWHAT: 2,
      ISOLATED: 4
    }
  },
  focus: {
    label: "Mental Focus",
    options: {
      CLEAR: 0,
      DISTRACTED: 2,
      FOGGY: 4
    }
  },
  appetite: {
    label: "Appetite & Routine",
    options: {
      REGULAR: 0,
      REDUCED: 2,
      IRREGULAR: 4
    }
  },
  sense_of_safety: {
    label: "Sense of Safety",
    isSafetyQuestion: true,
    options: {
      yes: 0, SAFE: 0,
      unsure: 3, ANXIOUS: 3,
      no: 5, UNSAFE: 5
    }
  },
  safety: {
    label: "Sense of Safety",
    isSafetyQuestion: true,
    options: {
      SAFE: 0,
      ANXIOUS: 3,
      UNSAFE: 5
    }
  },
  coping_ability: {
    label: "Coping Ability",
    options: {
      very_confident: 0, STRONG: 0,
      confident: 1,
      unsure: 2, STRUGGLING: 3,
      struggling: 4, UNABLE: 5,
      unable_to_cope: 5
    }
  },
  coping: {
    label: "Coping Ability",
    options: {
      STRONG: 0,
      STRUGGLING: 3,
      UNABLE: 5
    }
  },
  outlook: {
    label: "Future Outlook",
    options: {
      OPTIMISTIC: 0,
      UNCERTAIN: 2,
      HOPELESS: 5
    }
  },
  overall_wellbeing: {
    label: "Overall Wellbeing",
    options: {
      very_positive: 0,
      positive: 1,
      fair: 2,
      low: 4,
      very_low: 5
    }
  }
};

/**
 * Determine risk level from numeric score (0-100)
 */
function getRiskLevel(score) {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 50) return "Elevated";
  if (score >= 25) return "Mild";
  return "Stable";
}

/**
 * Determine default supportive non-diagnostic guidance based on risk level
 */
function getDefaultSupportRecommendation(riskLevel, safetyConcern) {
  if (safetyConcern) {
    return "Your safety is the highest priority. Immediate professional and human crisis support resources are available 24/7.";
  }

  switch (riskLevel) {
    case "Critical":
      return "Prioritize immediate human connection. Reach out to a verified crisis helpline or a trusted professional right away.";
    case "High":
      return "We strongly encourage speaking with a qualified mental health professional or counselor who can support you.";
    case "Elevated":
      return "Consider scheduling time with a counselor or reaching out to someone you trust. Grounding exercises and regular check-ins may also help.";
    case "Mild":
      return "Continue monitoring your wellbeing, engage in restorative routines, and stay connected with trusted family or friends.";
    case "Stable":
    default:
      return "Maintain your supportive daily habits, grounding practices, and regular check-ins to protect your peace.";
  }
}

/**
 * Calculate deterministic Dhriti Index and trend analysis
 */
function calculateDhritiIndex(structuredResponses, previousCheckIns = [], aiSignals = null) {
  let totalRawScore = 0;
  let maxPossibleRawScore = 0;
  let safetyOverride = false;
  const noticedItems = [];

  const responseKeys = Object.keys(structuredResponses || {});

  for (const qKey of responseKeys) {
    const qConfig = QUESTION_SCORING_MATRIX[qKey];
    const selectedOption = structuredResponses[qKey];
    maxPossibleRawScore += 5;

    if (qConfig && selectedOption && qConfig.options[selectedOption] !== undefined) {
      const points = qConfig.options[selectedOption];
      totalRawScore += points;

      if ((qKey === "sense_of_safety" || qKey === "safety") && (selectedOption === "no" || selectedOption === "UNSAFE")) {
        safetyOverride = true;
      }

      if (points >= 4) {
        noticedItems.push(`Elevated distress noted in ${qConfig.label || qKey}`);
      }
    } else {
      totalRawScore += 1;
    }
  }

  if (maxPossibleRawScore === 0) maxPossibleRawScore = 50;

  if (aiSignals && aiSignals.safetyConcern === true) {
    safetyOverride = true;
  }

  let baseScore = Math.round((totalRawScore / maxPossibleRawScore) * 100);
  baseScore = Math.min(100, Math.max(0, baseScore));

  let riskLevel = getRiskLevel(baseScore);

  if (safetyOverride && baseScore < 70) {
    riskLevel = "High";
  }

  let trend = "STABLE";
  let deltaPoints = 0;
  let rapidIncreaseDetected = false;

  if (previousCheckIns && previousCheckIns.length > 0) {
    const lastCheckIn = previousCheckIns[0];
    const prevScore = typeof lastCheckIn.dhritiIndex === "number" ? lastCheckIn.dhritiIndex : parseFloat(lastCheckIn.dhritiIndex);
    
    deltaPoints = Math.round((baseScore - prevScore) * 10) / 10;

    if (deltaPoints >= 5) {
      trend = "INCREASING";
    } else if (deltaPoints <= -5) {
      trend = "IMPROVING";
    } else {
      trend = "STABLE";
    }
  }

  const supportRecommendation = (aiSignals && aiSignals.supportRecommendation)
    ? aiSignals.supportRecommendation
    : getDefaultSupportRecommendation(riskLevel, safetyOverride);

  return {
    dhritiIndex: baseScore,
    riskLevel,
    trend,
    deltaPoints,
    safetyConcern: safetyOverride,
    rapidIncreaseDetected,
    noticedItems,
    supportRecommendation
  };
}

module.exports = {
  QUESTION_SCORING_MATRIX,
  calculateDhritiIndex,
  getRiskLevel,
  getDefaultSupportRecommendation
};
