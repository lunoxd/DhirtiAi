/**
 * Groq AI Mental Wellbeing Qualitative Analysis Service
 * Evaluates optional written reflections in combination with structured signals.
 * STRICTLY NON-DIAGNOSTIC.
 */

const SYSTEM_PROMPT = `
You are the AI qualitative distress-signal analysis engine for DHRITI, a mental wellbeing monitoring and early distress-support platform for survivors and individuals experiencing severe stress.

CRITICAL OPERATIONAL & SAFETY MANDATES:
1. YOU MUST NEVER DIAGNOSE ANY MEDICAL OR PSYCHIATRIC CONDITION (e.g., do not say "You have PTSD", "You suffer from major depression", "You have generalized anxiety disorder").
2. The Dhriti Index is a distress-risk and wellbeing indicator, NEVER a medical diagnosis.
3. NEVER claim medical certainty or prescribe clinical/medical treatment.
4. NEVER minimize distress, dismiss experiences, or tell users "You are completely fine" or "Don't worry about it".
5. Evaluate concerning or traumatic language CONSERVATIVELY.
6. If the text expresses thoughts of immediate self-harm, suicide, violence, or being in immediate physical danger, YOU MUST SET "safetyConcern": true.
7. Always recommend human professional support, crisis resources, or trusted connections when distress signals are elevated.
8. RETURN ONLY A VALID JSON OBJECT matching the schema below. DO NOT include markdown code blocks, backticks, or any conversational text outside JSON.

JSON OUTPUT SCHEMA:
{
  "distressIndicators": ["string", "string"],
  "trendSignals": ["string"],
  "severity": "low" | "moderate" | "high" | "critical",
  "safetyConcern": boolean,
  "summary": "Concise 1-2 sentence non-diagnostic reflection on what was shared.",
  "supportRecommendation": "Supportive 1-2 sentence suggestion pointing to human support or grounding practices."
}
`;

function getFallbackAnalysis(structuredResponses, writtenText = "") {
  const hasWriting = writtenText && writtenText.trim().length > 0;
  const isSafetyNo = structuredResponses?.sense_of_safety === "no";
  const indicators = [];
  
  if (structuredResponses?.stress === "very_stressed" || structuredResponses?.stress === "extremely_stressed") {
    indicators.push("Elevated tension and stress reported");
  }
  if (structuredResponses?.sleep === "poor" || structuredResponses?.sleep === "very_poor") {
    indicators.push("Disrupted sleep patterns");
  }
  if (structuredResponses?.intrusive_thoughts === "often" || structuredResponses?.intrusive_thoughts === "very_often") {
    indicators.push("Recurring intrusive thoughts or memories");
  }
  if (structuredResponses?.social_connection === "very_isolated" || structuredResponses?.social_connection === "completely_isolated") {
    indicators.push("Feelings of isolation");
  }
  if (indicators.length === 0) {
    indicators.push("General wellbeing recorded");
  }

  let severity = "moderate";
  if (isSafetyNo) {
    severity = "critical";
  } else if (indicators.length >= 3) {
    severity = "high";
  } else if (indicators.length <= 1) {
    severity = "low";
  }

  return {
    distressIndicators: indicators,
    trendSignals: ["Self-reported check-in markers"],
    severity,
    safetyConcern: isSafetyNo,
    summary: hasWriting 
      ? "Your reflections have been recorded. Thank you for sharing your thoughts." 
      : "Check-in responses processed. Wellbeing indicators updated.",
    supportRecommendation: isSafetyNo
      ? "Immediate human and crisis support is available. Please connect with emergency services or a trusted contact."
      : "Engaging in grounding exercises and reaching out to trusted support can be beneficial."
  };
}

async function analyzeWithGroq(structuredResponses, writtenResponses = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  const writtenText = Object.values(writtenResponses || {})
    .filter(val => typeof val === "string" && val.trim().length > 0)
    .join("\n\n");

  // If no Groq API Key, use deterministic fallback
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    return getFallbackAnalysis(structuredResponses, writtenText);
  }

  try {
    const userContent = `
Structured Responses Context:
${JSON.stringify(structuredResponses, null, 2)}

User's Optional Written Responses:
${writtenText || "No written text provided."}

Please analyze the emotional distress signals conservatively and return JSON according to the schema.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Groq API returned non-200 status:", response.status, errText);
      return getFallbackAnalysis(structuredResponses, writtenText);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;
    if (!responseText) {
      return getFallbackAnalysis(structuredResponses, writtenText);
    }

    const parsed = JSON.parse(responseText);

    return {
      distressIndicators: Array.isArray(parsed.distressIndicators) ? parsed.distressIndicators : ["Reported distress signals"],
      trendSignals: Array.isArray(parsed.trendSignals) ? parsed.trendSignals : ["Pattern monitoring"],
      severity: ["low", "moderate", "high", "critical"].includes(parsed.severity) ? parsed.severity : "moderate",
      safetyConcern: Boolean(parsed.safetyConcern || structuredResponses?.sense_of_safety === "no"),
      summary: typeof parsed.summary === "string" ? parsed.summary : "Responses processed.",
      supportRecommendation: typeof parsed.supportRecommendation === "string" ? parsed.supportRecommendation : "Consider human support resources if distress persists."
    };
  } catch (error) {
    console.error("Groq AI Analysis Warning:", error.message || error);
    return getFallbackAnalysis(structuredResponses, writtenText);
  }
}

module.exports = {
  analyzeWithGroq,
  getFallbackAnalysis
};
