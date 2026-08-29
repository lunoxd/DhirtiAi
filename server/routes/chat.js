const express = require("express");
const router = express.Router();

/**
 * Strips reasoning tokens like <think>...</think> from raw Groq responses
 */
function cleanAiResponse(text) {
  if (!text) return "";
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

/**
 * Empathetic Local Conversational Engine Fallback for DhritiAi
 */
function generateEmpatheticResponse(prompt) {
  const text = (prompt || "").toLowerCase().trim();

  // Crisis Protocol
  if (text.includes("kill") || text.includes("suicide") || text.includes("die") || text.includes("end my life") || text.includes("hurt myself") || text.includes("danger") || text.includes("unsafe")) {
    return `Your safety and wellbeing are deeply important. You do not have to carry this alone. Please connect with free, confidential 24/7 trained human crisis counselors right now:

• Tele-MANAS (Govt. of India): Call 14416 or 1800-891-4416 (Toll-Free)
• KIRAN Helpline: Call 1800-599-0019
• National Emergency Services: Call 112

If you are in immediate physical danger, please contact emergency rescue services or go to the nearest healthcare center.`;
  }

  // Anxiety & Panic
  if (text.includes("anxi") || text.includes("panic") || text.includes("fear") || text.includes("overwhelm") || text.includes("worry") || text.includes("scared") || text.includes("calm")) {
    return `I hear you, and it is completely understandable to feel overwhelmed or anxious. 

Here is a quick 5-4-3-2-1 sensory grounding exercise you can try right now:
1. 👁️ Look around and name 5 things you can see.
2. 🖐️ Touch 4 things around you (your clothes, desk, chair).
3. 👂 Listen for 3 distinct sounds.
4. 👃 Notice 2 things you can smell.
5. 👅 Take 1 deep breath in for 4 seconds and exhale slowly.

Remember, feelings are temporary like passing clouds. Take things one moment at a time.`;
  }

  // Breathing Guide
  if (text.includes("breath") || text.includes("inhale") || text.includes("exhale") || text.includes("4-7-8") || text.includes("box")) {
    return `Let's practice a soothing 4-4-4-4 Box Breathing cycle together:

1. 🫁 **Inhale** slowly through your nose for **4 seconds**.
2. ⏸️ **Hold** your breath gently for **4 seconds**.
3. 🌬️ **Exhale** smoothly through your mouth for **4 seconds**.
4. ⏸️ **Pause** and rest for **4 seconds**.

Repeat this 3 to 4 times to calm your nervous system.`;
  }

  // Sleep & Fatigue
  if (text.includes("sleep") || text.includes("insomnia") || text.includes("tired") || text.includes("exhausted") || text.includes("rest") || text.includes("night")) {
    return `Rest is essential for your emotional recovery and mental resilience. Here are a few evidence-based sleep hygiene tips:

• **Dim Bright Lights**: Turn off bright overhead lights and blue screens 45 minutes before bedtime.
• **Warm Bath or Tea**: A caffeine-free herbal tea or warm water can signal your nervous system to wind down.
• **Brain Dump**: Write down any lingering worries on a piece of paper to clear your mind before sleeping.
• **Progressive Relaxation**: Tense and release each muscle group starting from your toes up to your shoulders.`;
  }

  // Helplines & Support Contacts
  if (text.includes("helpline") || text.includes("contact") || text.includes("phone") || text.includes("number") || text.includes("doctor") || text.includes("emergency")) {
    return `Here are verified 24/7 mental health and crisis support helplines in India:

• **Tele-MANAS**: 14416 / 1800-891-4416 (24/7 Toll-Free in 20+ languages)
• **KIRAN Helpline**: 1800-599-0019 (24/7 Psychological First Aid)
• **Vandrevala Foundation**: +91 9999 666 555 (24/7 Crisis Counseling & WhatsApp)
• **NIMHANS Psychosocial**: 080-46110007
• **National Emergency**: 112`;
  }

  // Default Response
  return `Namaste! I am DhritiAi, your supportive mental health companion. 

I am here to listen and assist you with:
• **Emotional Grounding & Anxiety Relief**
• **Breathing Exercises (4-7-8 & Box Breathing)**
• **Sleep Hygiene & Stress Management**
• **24/7 Emergency Helpline Information**

How can I support your wellbeing right now?`;
}

// POST /api/chat - Conversation endpoint with DhritiAi
router.post("/", async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    let userPrompt = "";
    if (Array.isArray(messages) && messages.length > 0) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
      userPrompt = lastUserMsg ? lastUserMsg.content : "";
    } else if (userMessage) {
      userPrompt = userMessage;
    }

    const apiKey = process.env.GROQ_API_KEY;

    // Active Groq models
    const activeModels = [
      "qwen/qwen3.6-27b",
      "qwen/qwen3.8-27b",
      "groq/compound",
      "groq/compound-mini",
      "openai/gpt-oss-20b"
    ];

    let aiReply = "";

    if (apiKey && apiKey.length > 10) {
      for (const model of activeModels) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0"
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content: "You are DhritiAi, a compassionate, empathetic, non-diagnostic AI assistant for mental health, wellbeing, grounding, and survivor care. Provide clear, gentle, empathetic responses without internal thinking tags."
                },
                { role: "user", content: userPrompt || "Hello" }
              ],
              temperature: 0.7,
              max_tokens: 500
            })
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const rawContent = data.choices[0]?.message?.content;
            if (rawContent) {
              aiReply = cleanAiResponse(rawContent);
              if (aiReply.length > 0) {
                console.log(`[DhritiAi Chat] Dispatched response via Groq model (${model})`);
                break;
              }
            }
          }
        } catch (err) {
          console.warn(`[DhritiAi Chat] Model ${model} call note:`, err.message);
        }
      }
    }

    if (!aiReply) {
      aiReply = generateEmpatheticResponse(userPrompt);
    }

    return res.json({
      reply: aiReply,
      role: "assistant",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("DhritiAi Chat Error:", error);
    return res.json({
      reply: generateEmpatheticResponse(""),
      role: "assistant",
      fallback: true
    });
  }
});

module.exports = router;
