const http = require("http");
const app = require("./index");

const PORT = 5006;
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
              body: body ? JSON.parse(body) : null
            });
          } catch {
            resolve({
              statusCode: res.statusCode,
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

async function runChatTest() {
  console.log("--- Starting DhritiAi Chatbot Integration Tests ---");

  server = app.listen(PORT, async () => {
    try {
      const res = await request(
        { path: "/api/chat", method: "POST", headers: { "Content-Type": "application/json" } },
        { userMessage: "How can I calm anxiety right now?" }
      );

      console.log("Status:", res.statusCode);
      console.log("DhritiAi Reply:", res.body?.reply?.slice(0, 150) + "...");

      if (res.statusCode !== 200 || !res.body?.reply) {
        throw new Error("Chatbot API test failed");
      }

      console.log("\n🎉 DHRITIAI CHATBOT TEST PASSED!\n");
    } catch (err) {
      console.error("Chat Test Error:", err);
      process.exit(1);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runChatTest();
