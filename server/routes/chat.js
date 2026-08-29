const express = require("express");
const router = express.Router();

/**
 * Empathetic Local Conversational Engine for DhritiAi
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

Repeat this 3 to 4 times. You can also use the interactive Breathing Pacer on your Dashboard!`;
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

  // Sadness / Low Mood
  if (text.includes("sad") || text.includes("depress") || text.includes("lonely") || text.includes("cry") || text.includes("low") || text.includes("pain") || text.includes("grief")) {
    return `Thank you for sharing how you feel. It takes courage to acknowledge sadness or low mood.

Please treat yourself with gentle kindness today:
• Allow yourself to rest without judgment.
• Drink a cup of warm water or tea.
• Reach out to a friend, counselor, or loved one who respects your space.
• Remember that your current state does not define your future. You matter.`;
  }

  // Default Empathetic Response
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

    // Attempt Groq API call if key is present
    if (apiKey && apiKey.length > 10) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
                content: "You are DhritiAi, a gentle, empathetic, non-diagnostic AI assistant for mental health, wellbeing, grounding, and survivor care. Keep answers concise, empathetic, and warm."
              },
              { role: "user", content: userPrompt || "Hello" }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const cloudReply = data.choices[0]?.message?.content;
          if (cloudReply) {
            return res.json({
              reply: cloudReply,
              role: "assistant",
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.warn("[ChatRoute] Groq API call note:", err.message);
      }
    }

    // High-quality Empathetic Local Engine fallback
    const localReply = generateEmpatheticResponse(userPrompt);

    return res.json({
      reply: localReply,
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
