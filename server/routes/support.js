const express = require("express");

const router = express.Router();

// GET /api/support/resources - Publicly accessible Indian & Global support directory
router.get("/resources", (req, res) => {
  const supportData = {
    emergency: {
      title: "Immediate Crisis & Safety Support",
      description: "If you feel in immediate danger, cannot stay safe, or need urgent human support, please reach out to these 24/7 confidential helplines:",
      contacts: [
        {
          id: "tele-manas",
          name: "Tele-MANAS (Govt. of India)",
          tag: "National Mental Health Programme",
          category: "government",
          number: "14416",
          altNumber: "1800-891-4416",
          available: "24/7 Toll-Free",
          languages: "Hindi, English & 20+ Regional Languages",
          country: "India",
          description: "Apex national tele-mental health service initiated by the Ministry of Health and Family Welfare, providing immediate psychosocial support across all Indian states.",
          actionType: "call"
        },
        {
          id: "kiran",
          name: "KIRAN National Helpline",
          tag: "Ministry of Social Justice & Empowerment",
          category: "government",
          number: "1800-599-0019",
          available: "24/7 Toll-Free",
          languages: "Hindi, English, Tamil, Telugu, Marathi, Bengali, Gujarati & 7 others",
          country: "India",
          description: "Dedicated national helpline providing early screening, psychological first aid, crisis intervention, mental wellbeing counseling, and referral to clinical psychologists.",
          actionType: "call"
        },
        {
          id: "vandrevala",
          name: "Vandrevala Foundation",
          tag: "Crisis & Suicide Intervention",
          category: "crisis",
          number: "+91 9999 666 555",
          available: "24/7 Free",
          languages: "Hindi, English, Gujarati, Marathi, Tamil, Bengali",
          country: "India / WhatsApp",
          description: "Free, round-the-clock professional counseling support for emotional distress, anxiety, trauma, and crisis situations via direct phone calls and WhatsApp messaging.",
          actionType: "both",
          whatsapp: "919999666555"
        },
        {
          id: "nimhans",
          name: "NIMHANS Psychosocial Support",
          tag: "National Center of Excellence",
          category: "clinical",
          number: "080-46110007",
          available: "24/7 Support",
          languages: "Hindi, English, Kannada, Tamil, Telugu, Malayalam",
          country: "India",
          description: "Run by National Institute of Mental Health and Neuro-Sciences (NIMHANS) Bengaluru, offering expert psychological counseling and survivor support.",
          actionType: "call"
        },
        {
          id: "icall-tiss",
          name: "iCALL Helpline (TISS)",
          tag: "Tata Institute of Social Sciences",
          category: "counseling",
          number: "9152987821",
          altNumber: "022-25521111",
          available: "Mon–Sat, 10 AM – 8 PM",
          languages: "Hindi, English, Marathi, Gujarati, Bengali, Tamil, Malayalam",
          country: "India",
          description: "Free counseling service providing psycho-social support by qualified mental health professionals for trauma, emotional abuse, and mental distress.",
          actionType: "call"
        },
        {
          id: "aasra",
          name: "AASRA Crisis Line",
          tag: "Crisis Intervention & Suicide Prevention",
          category: "crisis",
          number: "+91 9820466726",
          available: "24/7",
          languages: "English, Hindi",
          country: "India",
          description: "Voluntary organization committed to providing confidential emotional support for persons going through distress, loneliness, or suicidal thoughts.",
          actionType: "call"
        },
        {
          id: "ncw",
          name: "NCW 24/7 Women Helpline",
          tag: "National Commission for Women",
          category: "women_trauma",
          number: "7827170170",
          available: "24/7",
          languages: "Hindi, English & Regional",
          country: "India",
          description: "Emergency helpline for women survivors of violence, abuse, and atrocities to receive immediate counseling, shelter coordination, and police aid.",
          actionType: "call"
        },
        {
          id: "emergency-112",
          name: "National Emergency Response (ERSS)",
          tag: "Unified Police & Medical Emergency",
          category: "emergency",
          number: "112",
          available: "24/7 Instant Response",
          languages: "All Indian Languages",
          country: "India",
          description: "India's single unified emergency response number for immediate police, ambulance, fire, and survivor rescue assistance in life-threatening emergencies.",
          actionType: "call"
        }
      ]
    },
    grounding: [
      {
        id: "breathing-478",
        title: "4-7-8 Deep Relaxation Breath",
        duration: "2–3 Minutes",
        description: "A yogic breath practice (Pranayama) that calms the central nervous system rapidly.",
        steps: [
          "Inhale quietly through your nose for 4 seconds",
          "Hold your breath gently for 7 seconds",
          "Exhale completely through your mouth for 8 seconds",
          "Repeat for 4 to 8 soothing cycles"
        ]
      },
      {
        id: "sensory-54321",
        title: "5-4-3-2-1 Grounding Technique",
        duration: "3–5 Minutes",
        description: "Brings your awareness back to the physical room and away from distressing memories or panic.",
        steps: [
          "5 things you can see around you (name them in your mind)",
          "4 things you can feel physically (e.g. feet on the floor, texture of clothing)",
          "3 sounds you can hear right now",
          "2 scents you can smell or enjoy",
          "1 taste or soothing affirmation ('I am safe right here, right now')"
        ]
      },
      {
        id: "box-breathing",
        title: "Box Breathing (Sama Vritti)",
        duration: "2 Minutes",
        description: "Equal-ratio breathing used to steady the heart rate and regain emotional equilibrium.",
        steps: [
          "Inhale for 4 seconds",
          "Hold breath for 4 seconds",
          "Exhale for 4 seconds",
          "Hold empty for 4 seconds"
        ]
      }
    ]
  };

  return res.json(supportData);
});

module.exports = router;
