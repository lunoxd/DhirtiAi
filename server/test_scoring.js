const assert = require("assert");
const { calculateDhritiIndex, getRiskLevel } = require("./services/scoringEngine");
const { getFallbackAnalysis } = require("./services/groqService");

console.log("--- Starting DHRITI Scoring Engine & Service Unit Tests ---");

// Test 1: Low distress responses should produce Stable score (0-24)
const lowResponses = {
  mood: "very_good",
  stress: "not_at_all",
  sleep: "very_good",
  daily_functioning: "very_easy",
  social_connection: "very_connected",
  intrusive_thoughts: "never",
  emotional_control: "in_control",
  coping_ability: "very_confident",
  sense_of_safety: "yes",
  overall_wellbeing: "very_positive"
};

const resLow = calculateDhritiIndex(lowResponses);
console.log("Test 1 - Low distress score:", resLow.dhritiIndex, "Risk:", resLow.riskLevel);
assert.strictEqual(resLow.dhritiIndex, 0, "All 0 answers must yield 0 score");
assert.strictEqual(resLow.riskLevel, "Stable", "0 score must be Stable");
assert.strictEqual(resLow.safetyConcern, false);

// Test 2: Maximum distress responses should produce Critical score (85-100)
const highResponses = {
  mood: "very_difficult",
  stress: "extremely_stressed",
  sleep: "very_poor",
  daily_functioning: "unable_to_function",
  social_connection: "completely_isolated",
  intrusive_thoughts: "very_often",
  emotional_control: "constantly_overwhelmed",
  coping_ability: "unable_to_cope",
  sense_of_safety: "no",
  overall_wellbeing: "very_low"
};

const resHigh = calculateDhritiIndex(highResponses);
console.log("Test 2 - High distress score:", resHigh.dhritiIndex, "Risk:", resHigh.riskLevel);
assert.strictEqual(resHigh.dhritiIndex, 100, "All max answers must yield 100 score");
assert.strictEqual(resHigh.riskLevel, "Critical", "100 score must be Critical");
assert.strictEqual(resHigh.safetyConcern, true, "Sense of safety 'no' must trigger safetyConcern");

// Test 3: Safety Question Override when general score is moderate/low
const mixedResponsesWithUnsafe = {
  mood: "good",
  stress: "a_little",
  sleep: "good",
  daily_functioning: "manageable",
  social_connection: "moderately_connected",
  intrusive_thoughts: "rarely",
  emotional_control: "mostly_calm",
  coping_ability: "confident",
  sense_of_safety: "no", // UNSAFE!
  overall_wellbeing: "positive"
};

const resUnsafe = calculateDhritiIndex(mixedResponsesWithUnsafe);
console.log("Test 3 - Safety Override score:", resUnsafe.dhritiIndex, "Risk:", resUnsafe.riskLevel, "SafetyConcern:", resUnsafe.safetyConcern);
assert.strictEqual(resUnsafe.safetyConcern, true, "Must flag safety concern");
assert.ok(resUnsafe.riskLevel === "High" || resUnsafe.riskLevel === "Critical", "Risk level must escalate on safety override");

// Test 4: Historical Trend calculation
const prevCheckIns = [
  { dhritiIndex: 35 },
  { dhritiIndex: 30 }
];
const currentElevated = {
  mood: "difficult",
  stress: "very_stressed",
  sleep: "poor",
  daily_functioning: "somewhat_difficult",
  social_connection: "somewhat_isolated",
  intrusive_thoughts: "often",
  emotional_control: "occasionally_overwhelmed",
  coping_ability: "struggling",
  sense_of_safety: "yes",
  overall_wellbeing: "low"
};
const resTrend = calculateDhritiIndex(currentElevated, prevCheckIns);
console.log("Test 4 - Trend:", resTrend.trend, "Delta:", resTrend.deltaPoints, "Score:", resTrend.dhritiIndex);
assert.strictEqual(resTrend.trend, "INCREASING", "Significant rise should be INCREASING trend");
assert.ok(resTrend.deltaPoints > 0, "Delta points must be positive");

// Test 5: Fallback Analysis Service
const fallback = getFallbackAnalysis(highResponses, "I am feeling overwhelmed.");
console.log("Test 5 - Fallback summary:", fallback.summary, "Safety Concern:", fallback.safetyConcern);
assert.ok(fallback.distressIndicators.length > 0, "Must extract indicators");
assert.strictEqual(fallback.safetyConcern, true, "Fallback must also respect safety question");

console.log("✅ All Backend Scoring & Safety Tests Passed Successfully!");
