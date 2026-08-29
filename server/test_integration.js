const http = require("http");
const app = require("./index");

const PORT = 5002; // Use test port
let server;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: PORT,
        ...options
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: body ? JSON.parse(body) : null
            });
          } catch {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body
            });
          }
        });
      }
    );

    req.on("error", reject);

    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runIntegrationTests() {
  console.log("--- Starting End-to-End Backend Integration Tests ---");
  
  server = app.listen(PORT, async () => {
    try {
      // 1. Health check test
      const health = await request({ path: "/api/health", method: "GET" });
      console.log("1. Health check:", health.body.status, "service:", health.body.service);
      if (health.statusCode !== 200) throw new Error("Health check failed");

      // 2. Register test user
      const testEmail = `test_${Date.now()}@dhriti.org`;
      const regRes = await request(
        {
          path: "/api/auth/register",
          method: "POST",
          headers: { "Content-Type": "application/json" }
        },
        { name: "Maya Survivor", email: testEmail, password: "SecurePassword123!" }
      );
      console.log("2. Registration status:", regRes.statusCode, "User:", regRes.body?.user?.name);
      if (regRes.statusCode !== 201) throw new Error("Registration failed");
      const token = regRes.body.token;

      // 3. Submit first Check-in (Mild/Low distress)
      const checkIn1 = await request(
        {
          path: "/api/checkins",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        },
        {
          structuredResponses: {
            mood: "good",
            stress: "a_little",
            sleep: "good",
            daily_functioning: "manageable",
            social_connection: "very_connected",
            intrusive_thoughts: "rarely",
            emotional_control: "mostly_calm",
            coping_ability: "confident",
            sense_of_safety: "yes",
            overall_wellbeing: "positive"
          },
          writtenResponses: {
            general_reflection: "Feeling relatively peaceful today."
          }
        }
      );
      console.log("3. Check-in 1 Index:", checkIn1.body?.checkIn?.dhritiIndex, "Risk:", checkIn1.body?.checkIn?.riskLevel);
      if (checkIn1.statusCode !== 201) throw new Error("Check-in 1 failed");

      // 4. Submit second Check-in (Spike to Elevated)
      const checkIn2 = await request(
        {
          path: "/api/checkins",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        },
        {
          structuredResponses: {
            mood: "difficult",
            stress: "very_stressed",
            sleep: "poor",
            daily_functioning: "hard_to_manage",
            social_connection: "very_isolated",
            intrusive_thoughts: "often",
            emotional_control: "frequently_overwhelmed",
            coping_ability: "struggling",
            sense_of_safety: "yes",
            overall_wellbeing: "low"
          },
          writtenResponses: {
            general_reflection: "Having intense stress since yesterday."
          }
        }
      );
      console.log(
        "4. Check-in 2 Index:",
        checkIn2.body?.checkIn?.dhritiIndex,
        "Risk:",
        checkIn2.body?.checkIn?.riskLevel,
        "Trend:",
        checkIn2.body?.checkIn?.trend,
        "Delta:",
        checkIn2.body?.checkIn?.deltaPoints
      );
      if (checkIn2.body?.checkIn?.trend !== "INCREASING") {
        throw new Error("Expected INCREASING trend on distress spike");
      }

      // 5. Submit Check-in with Safety Question = 'no' (Immediate Safety Trigger)
      const checkIn3 = await request(
        {
          path: "/api/checkins",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        },
        {
          structuredResponses: {
            mood: "okay",
            stress: "somewhat",
            sleep: "okay",
            daily_functioning: "manageable",
            social_connection: "moderately_connected",
            intrusive_thoughts: "sometimes",
            emotional_control: "mostly_calm",
            coping_ability: "unsure",
            sense_of_safety: "no", // UNSAFE!
            overall_wellbeing: "fair"
          }
        }
      );
      console.log(
        "5. Safety check Check-in 3 - Safety Concern:",
        checkIn3.body?.checkIn?.safetyConcern,
        "Risk Level:",
        checkIn3.body?.checkIn?.riskLevel
      );
      if (!checkIn3.body?.checkIn?.safetyConcern) {
        throw new Error("Expected safetyConcern = true on sense_of_safety = 'no'");
      }

      // 6. Test GET /api/dhriti/current
      const currentRes = await request({
        path: "/api/dhriti/current",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("6. Current Dhriti score:", currentRes.body?.dhritiIndex, "Has safety alert:", currentRes.body?.safetyConcern);

      // 7. Test GET /api/dhriti/trend
      const trendRes = await request({
        path: "/api/dhriti/trend",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("7. Dhriti trend timeline points count:", trendRes.body?.count);
      if (trendRes.body?.count !== 3) {
        throw new Error("Expected 3 trend data points");
      }

      // 8. Test Support resources endpoint
      const supportRes = await request({
        path: "/api/support/resources",
        method: "GET"
      });
      console.log("8. Support verified contacts count:", supportRes.body?.emergency?.contacts?.length);

      // 9. Test DELETE all user data (Privacy feature)
      const deleteRes = await request({
        path: "/api/checkins",
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("9. Wiped check-ins count:", deleteRes.body?.deletedCount);
      if (deleteRes.body?.deletedCount !== 3) {
        throw new Error("Expected 3 deleted records");
      }

      console.log("\n🎉 ALL INTEGRATION & FLOW TESTS PASSED FLAWLESSLY!\n");
    } catch (err) {
      console.error("Integration Test Error:", err);
      process.exit(1);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runIntegrationTests();
