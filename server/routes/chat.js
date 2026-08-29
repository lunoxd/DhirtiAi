const express = require("express");
const Groq = require("groq-sdk");
const router = express.Router();

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const SYSTEM_PROMPT = `
You are DhritiAi, a compassionate, empathetic, non-diagnostic AI assistant specializing in mental health support, emotional wellbeing, stress management, grounding exercises, and survivor support.

Guidelines:
1. Warmth & Empathy: Speak gently, supportive, and attentively. Validate the user's feelings.
2. Mental Health & Wellness Focus: Offer practical grounding techniques (e.g. 4-7-8 breathing, 5-4-3-2-1 sensory grounding), coping strategies, sleep hygiene, and emotional self-care tips.
3. Non-Diagnostic Safety: Never attempt medical diagnosis or prescribe medications. Remind users that you are an AI support tool.
4. Crisis Protocols: If the user expresses thoughts of self-harm, suicide, or severe crisis, immediately urge them to connect with human emergency support:
   - Tele-MANAS (Govt. of India): 14416 or 1800-891-4416 (24/7 Toll-Free)
   - KIRAN Helpline: 1800-599-0019 (24/7)
   - National Emergency: 112
5. Conciseness: Keep responses structured, concise, and easy to read (max 2-3 short paragraphs or bullet points).
`;

// POST /api/chat - Conversation endpoint with DhritiAi
router.post("/", async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    let chatHistory = [];
    if (Array.isArray(messages) && messages.length > 0) {
      chatHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }));
    } else if (userMessage) {
      chatHistory = [{ role: "user", content: userMessage }];
    } else {
      return res.status(400).json({ error: "Message prompt is required." });
    }

    if (!groq) {
      return res.json({
        reply: "I am here with you. If you are feeling overwhelmed, taking a slow deep breath in for 4 seconds and exhaling for 4 seconds can help bring calm. You can also reach Tele-MANAS anytime at 14416.",
        role: "assistant",
        fallback: true
      });
    }

    // Call Groq API with supported models
    const modelsToTry = ["llama-3.1-8b-instant", "llama3-70b-8192", "mixtral-8x7b-32768"];
    let response;

    for (const model of modelsToTry) {
      try {
        response = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...chatHistory.slice(-8)
          ],
          temperature: 0.7,
          max_tokens: 600
        });
        if (response?.choices[0]?.message?.content) break;
      } catch (err) {
        // try next model
      }
    }

    const reply = response?.choices[0]?.message?.content ||
      "I am here for you. If you are feeling overwhelmed, taking a slow deep breath in for 4 seconds and exhaling for 4 seconds can help bring calm. You can also reach Tele-MANAS anytime at 14416.";

    return res.json({
      reply,
      role: "assistant",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("DhritiAi Chat Error:", error);

    return res.json({
      reply: "I am here with you. If you are feeling overwhelmed, taking a slow deep breath in for 4 seconds and exhaling for 4 seconds can help bring calm. You can also reach Tele-MANAS anytime at 14416.",
      role: "assistant",
      fallback: true
    });
  }
});

module.exports = router;
