require("dotenv").config();
const { analyzeWithGroq } = require("./services/groqService");

async function testLiveGroq() {
  console.log("Testing live Groq API key...");
  const mockResponses = {
    mood: "difficult",
    stress: "very_stressed",
    sleep: "poor",
    sense_of_safety: "yes"
  };
  const mockWritten = {
    general_reflection: "I haven't been able to sleep well after remembering past traumatic incidents, and my heart races often."
  };

  try {
    const result = await analyzeWithGroq(mockResponses, mockWritten);
    console.log("Groq Live Result:", JSON.stringify(result, null, 2));
    if (result.distressIndicators && result.summary) {
      console.log("✅ Groq API connection successful and structured JSON returned!");
    } else {
      console.error("❌ Groq response was incomplete.");
    }
  } catch (err) {
    console.error("Groq test error:", err);
  }
}

testLiveGroq();
