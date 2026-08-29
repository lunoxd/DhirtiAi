const http = require("http");
const app = require("./index");

const PORT = 5005;
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

async function runOtpTest() {
  console.log("--- Starting Resend.com Gmail OTP Verification Tests ---");

  server = app.listen(PORT, async () => {
    try {
      const testEmail = `test.user.${Date.now()}@gmail.com`;

      // 1. Send OTP
      const sendRes = await request(
        { path: "/api/auth/send-otp", method: "POST", headers: { "Content-Type": "application/json" } },
        { email: testEmail }
      );
      console.log("1. Send OTP Status:", sendRes.statusCode, "Message:", sendRes.body?.message);
      if (sendRes.statusCode !== 200) throw new Error("Failed to send OTP");

      const otpCode = sendRes.body.otpCode;
      console.log("Generated OTP code for verification:", otpCode);

      // 2. Verify OTP
      const verifyRes = await request(
        { path: "/api/auth/verify-otp", method: "POST", headers: { "Content-Type": "application/json" } },
        { email: testEmail, otp: otpCode }
      );
      console.log("2. Verify OTP Status:", verifyRes.statusCode, "Verified:", verifyRes.body?.verified);
      if (verifyRes.statusCode !== 200 || !verifyRes.body?.verified) throw new Error("OTP verification failed");

      // 3. Register Account with Verified Gmail
      const regRes = await request(
        { path: "/api/auth/register", method: "POST", headers: { "Content-Type": "application/json" } },
        { name: "Verified User", email: testEmail, password: "DhritiPassword2026!", otp: otpCode }
      );
      console.log("3. Register Status:", regRes.statusCode, "Email Verified:", regRes.body?.user?.isEmailVerified);
      if (regRes.statusCode !== 201 || !regRes.body?.user?.isEmailVerified) throw new Error("Registration with verified Gmail failed");

      console.log("\n🎉 RESEND.COM GMAIL OTP VERIFICATION TEST PASSED!\n");
    } catch (err) {
      console.error("OTP Test Error:", err);
      process.exit(1);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runOtpTest();
