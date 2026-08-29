/**
 * DHRITI Groq & Empathetic AI Engine
 * Processes written check-ins and returns structured qualitative analysis.
 */

async function analyzeWrittenResponses(writtenResponses, scoreData) {
  const apiKey = process.env.GROQ_API_KEY;

  const promptText = typeof writtenResponses === "string"
    ? writtenResponses
    : Object.values(writtenResponses || {}).join(" ");

  if (!promptText || promptText.trim().length === 0) {
    return {
      summary: "Routine check-in completed based on structured answers.",
      observations: ["No additional written notes provided."],
      recommendedCare: "Continue regular daily check-ins to monitor wellbeing trends."
    };
  }

  // Attempt Groq Cloud API if configured
  if (apiKey && apiKey.length > 10) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a trauma-informed clinical AI assistant. Analyze user written responses and return JSON with keys: 'summary' (string), 'observations' (array of strings), 'recommendedCare' (string)."
            },
            {
              role: "user",
              content: `User Score: ${scoreData?.score}/100 (${scoreData?.riskLevel}). Written text: "${promptText}"`
            }
          ],
          temperature: 0.5,
          response_format: { type: "json_object" }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            summary: parsed.summary || "Analysis generated from written reflection.",
            observations: parsed.observations || ["Monitored user reflections."],
            recommendedCare: parsed.recommendedCare || "Practice calming self-care routines."
          };
        }
      }
    } catch (err) {
      console.warn("[GroqService] Cloud API fallback to Local Empathetic AI Engine:", err.message);
    }
  }

  // Built-in Empathetic AI Analysis Engine
  const textLower = promptText.toLowerCase();

  let summary = "Your reflection highlights feelings you are processing. Acknowledging your emotions is a meaningful step toward self-awareness.";
  const observations = [];
  let recommendedCare = "Engage in gentle grounding exercises and reach out to trusted support networks.";

  if (textLower.includes("sleep") || textLower.includes("tired") || textLower.includes("exhausted") || textLower.includes("insomnia")) {
    observations.push("Sleep disruptions or fatigue noted in your reflection.");
    recommendedCare = "Try dimming screens 1 hour before sleep and practicing 4-7-8 box breathing.";
  }

  if (textLower.includes("anxious") || textLower.includes("panic") || textLower.includes("worry") || textLower.includes("fear") || textLower.includes("scared")) {
    observations.push("Elevated anxiety or uneasy feelings expressed.");
    summary = "You expressed feeling anxious or uneasy. Taking things one slow step at a time can help restore emotional balance.";
  }

  if (textLower.includes("sad") || textLower.includes("lonely") || textLower.includes("cry") || textLower.includes("hopeless") || textLower.includes("alone")) {
    observations.push("Feelings of sadness or emotional isolation identified.");
    summary = "Feeling down or isolated can be heavy. Remember that seeking connection or talking to a counselor is a strength.";
  }

  if (textLower.includes("hurt") || textLower.includes("die") || textLower.includes("kill") || textLower.includes("danger") || textLower.includes("unsafe")) {
    observations.push("Critical distress or safety concerns detected.");
    summary = "Immediate human support and safety resources are strongly recommended.";
    recommendedCare = "Please connect immediately with Tele-MANAS (14416) or KIRAN Helpline (1800-599-0019).";
  }

  if (observations.length === 0) {
    observations.push("Expressed written thoughts on daily routines and emotions.");
  }

  return {
    summary,
    observations,
    recommendedCare
  };
}

module.exports = {
  analyzeWrittenResponses
};
