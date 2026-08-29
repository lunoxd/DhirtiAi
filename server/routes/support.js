const express = require("express");

const router = express.Router();

// GET /api/support/resources - Publicly accessible support & crisis directory
router.get("/resources", (req, res) => {
  const supportData = {
    emergency: {
      title: "Immediate Crisis & Safety Support",
      description: "If you feel in immediate danger, cannot stay safe, or need urgent human support, please reach out to these 24/7 confidential helplines:",
      contacts: [
        {
          name: "National Emergency Helpline",
          number: "112",
          available: "24/7",
          type: "Emergency Services",
          country: "India",
          description: "All-in-one emergency response for police, medical, and rescue assistance."
        },
        {
          name: "Tele-MANAS (Govt of India)",
          number: "14416 / 1800-891-4416",
          available: "24/7",
          type: "Mental Health Support",
          country: "India",
          description: "Free, multi-lingual government tele-mental health support across India."
        },
        {
          name: "KIRAN Mental Health Helpline",
          number: "1800-599-0019",
          available: "24/7",
          type: "Psychological Support",
          country: "India",
          description: "Central helpline for early screening, psychological first aid, and crisis management."
        },
        {
          name: "Vandrevala Foundation",
          number: "+91 9999 666 555",
          available: "24/7",
          type: "Crisis Counseling",
          country: "India / WhatsApp",
          description: "Free counseling support via phone and WhatsApp in multiple languages."
        },
        {
          name: "NIMHANS Psychosocial Support",
          number: "080-46110007",
          available: "24/7",
          type: "Psychological Counseling",
          country: "India",
          description: "National Institute of Mental Health and Neuro-Sciences helpline."
        },
        {
          name: "International 988 Suicide & Crisis Lifeline",
          number: "988 (USA/Canada)",
          available: "24/7",
          type: "Crisis Lifeline",
          country: "USA & Canada",
          description: "Free and confidential support for anyone in distress."
        }
      ]
    },
    grounding: [
      {
        id: "breathing-478",
        title: "4-7-8 Calming Breath",
        duration: "2-3 Minutes",
        description: "Inhale quietly through your nose for 4 seconds. Hold your breath for 7 seconds. Exhale completely through your mouth making a whoosh sound for 8 seconds. Repeat 4 cycles.",
        steps: [
          "Inhale gently through your nose for 4 seconds",
          "Hold your breath comfortably for 7 seconds",
          "Slowly exhale through your mouth for 8 seconds",
          "Pause and repeat 4 times"
        ]
      },
      {
        id: "sensory-54321",
        title: "5-4-3-2-1 Sensory Grounding",
        duration: "3-5 Minutes",
        description: "Re-anchor yourself to the present moment by scanning your surroundings:",
        steps: [
          "5 things you can see around you",
          "4 things you can physically feel (e.g. feet on floor, cloth)",
          "3 things you can hear right now",
          "2 things you can smell or like the scent of",
          "1 positive affirmation or sensation you can taste"
        ]
      },
      {
        id: "box-breathing",
        title: "Box Breathing (4x4)",
        duration: "2 Minutes",
        description: "Used by first responders to regulate the nervous system quickly.",
        steps: [
          "Inhale for 4 seconds",
          "Hold for 4 seconds",
          "Exhale for 4 seconds",
          "Hold empty for 4 seconds"
        ]
      }
    ],
    guidance: {
      title: "How to Seek Human Support",
      tips: [
        "You do not need to explain every detail of what happened to ask for help.",
        "It is okay to say: 'I'm feeling overwhelmed and need someone to listen.'",
        "Writing down your feelings or showing your Dhriti Index trend can help a counselor understand where you are at.",
        "You deserve safe, confidential, and compassionate care."
      ]
    }
  };

  return res.json(supportData);
});

module.exports = router;
