const express = require("express");
const router = express.Router();

/**
 * Strips reasoning tokens like <think>...</think> from raw Groq responses
 */
function cleanAiResponse(text) {
  if (!text) return "";
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/<think>[\s\S]*/gi, ""); // Handle unclosed think blocks
  return cleaned.trim();
}

/**
 * Empathetic Local Conversational Engine Fallback for DhritiAi
 */
function generateEmpatheticResponse(prompt) {
  const text = (prompt || "").toLowerCase().trim();

  // Crisis Protocol
  if (text.includes("kill") || text.includes("suicide") || text.includes("die") || text.includes("end my life") || text.includes("hurt myself") || text.includes("danger") || text.includes("unsafe")) {
    return `Your safety is deeply important. Please connect with free, 24/7 human crisis counselors right now:

• Tele-MANAS (Govt. of India): Call 14416 (Toll-Free)
• KIRAN Helpline: Call 1800-599-0019
• National Emergency: Call 112

You are not alone. Please reach out to them immediately.`;
  }

  // Anxiety & Panic
  if (text.includes("anxi") || text.includes("panic") || text.includes("fear") || text.includes("overwhelm") || text.includes("worry") || text.includes("scared") || text.includes("calm")) {
    return `I hear you. When anxiety feels strong, try this quick 3-step calm routine:

1. 🫁 Take 3 slow, deep breaths (in for 4s, out for 4s).
2. 🖐️ Touch 3 objects around you to ground yourself.
3. 💬 Remind yourself: "This feeling is temporary and will pass."

You are safe right here in this moment.`;
  }

  // Breathing Guide
  if (text.includes("breath") || text.includes("inhale") || text.includes("exhale") || text.includes("4-7-8") || text.includes("box")) {
    return `Let's do a simple 4-4-4 Box Breath together:

• **Inhale** slowly through your nose for 4 seconds.
• **Hold** gently for 4 seconds.
• **Exhale** smoothly through your mouth for 4 seconds.
• **Pause** for 4 seconds.

Repeat this 3 times to quickly ease stress.`;
  }

  // Sleep & Fatigue
  if (text.includes("sleep") || text.includes("insomnia") || text.includes("tired") || text.includes("exhausted") || text.includes("rest") || text.includes("night")) {
    return `Here are 3 simple tips to help you sleep better tonight:

• Turn off phone screens 30 minutes before bed.
• Drink a cup of warm water or caffeine-free tea.
• Write down any lingering worries on a piece of paper to clear your mind.`;
  }

  // Helplines & Support Contacts
  if (text.includes("helpline") || text.includes("contact") || text.includes("phone") || text.includes("number") || text.includes("doctor") || text.includes("emergency")) {
    return `Official 24/7 mental health helplines in India:

• **Tele-MANAS**: 14416 (Toll-Free)
• **KIRAN Helpline**: 1800-599-0019
• **Vandrevala Foundation**: +91 9999 666 555
• **National Emergency**: 112`;
  }

  // Default Response
  return `Namaste! I am DhritiAi, your supportive mental health companion.

I can help you with:
• Quick grounding techniques for anxiety
• Simple breathing exercises
• Better sleep & stress relief tips
• 24/7 official helpline numbers

How can I help you feel better right now?`;
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
      "groq/compound-mini"
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
                  content: "You are DhritiAi, a gentle mental health assistant. Respond directly to the user. Do NOT write any internal thinking process, reasoning, or <think> tags. Keep responses very short, warm, and helpful (max 2-3 bullet points)."
                },
                { role: "user", content: userPrompt || "Hello" }
              ],
              temperature: 0.5,
              max_tokens: 450
            })
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const rawContent = data.choices[0]?.message?.content;
            if (rawContent) {
              aiReply = cleanAiResponse(rawContent);
              if (aiReply.length > 0) {
                console.log(`[DhritiAi Chat] Dispatched clean response via Groq model (${model})`);
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
