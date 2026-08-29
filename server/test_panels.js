const http = require("http");
const app = require("./index");

const PORT = 5003;
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

async function runPanelTests() {
  console.log("--- Starting 3-Panel Multi-Role & Permissions Tests ---");

  server = app.listen(PORT, async () => {
    try {
      // 1. Log in as Survivor User
      const userRes = await request(
        { path: "/api/auth/demo", method: "POST", headers: { "Content-Type": "application/json" } },
        { role: "USER" }
      );
      const userToken = userRes.body.token;
      console.log("1. Survivor User logged in:", userRes.body.user.role);

      // 2. Log in as Doctor
      const doctorRes = await request(
        { path: "/api/auth/demo", method: "POST", headers: { "Content-Type": "application/json" } },
        { role: "DOCTOR" }
      );
      const doctorToken = doctorRes.body.token;
      console.log("2. Doctor logged in:", doctorRes.body.user.name, "Role:", doctorRes.body.user.role);

      // 3. Log in as Admin
      const adminRes = await request(
        { path: "/api/auth/demo", method: "POST", headers: { "Content-Type": "application/json" } },
        { role: "ADMIN" }
      );
      const adminToken = adminRes.body.token;
      console.log("3. Admin logged in:", adminRes.body.user.name, "Role:", adminRes.body.user.role);

      // 4. Test User attempting Doctor route -> should be 403 Forbidden
      const forbiddenDoc = await request({
        path: "/api/doctor/triage",
        method: "GET",
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log("4. User accessing Doctor route status (should be 403):", forbiddenDoc.statusCode);
      if (forbiddenDoc.statusCode !== 403) throw new Error("Expected 403 Forbidden for User accessing Doctor route");

      // 5. Test Doctor accessing Doctor triage route -> should be 200 OK
      const docTriage = await request({
        path: "/api/doctor/triage",
        method: "GET",
        headers: { Authorization: `Bearer ${doctorToken}` }
      });
      console.log("5. Doctor accessing Doctor triage status:", docTriage.statusCode, "Queue count:", docTriage.body?.count);
      if (docTriage.statusCode !== 200) throw new Error("Expected 200 for Doctor triage");

      // 6. Test Doctor attempting Admin route -> should be 403 Forbidden
      const forbiddenAdmin = await request({
        path: "/api/admin/overview",
        method: "GET",
        headers: { Authorization: `Bearer ${doctorToken}` }
      });
      console.log("6. Doctor accessing Admin route status (should be 403):", forbiddenAdmin.statusCode);
      if (forbiddenAdmin.statusCode !== 403) throw new Error("Expected 403 for Doctor accessing Admin route");

      // 7. Test Admin accessing Admin overview -> should be 200 OK
      const adminOverview = await request({
        path: "/api/admin/overview",
        method: "GET",
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log("7. Admin overview status:", adminOverview.statusCode, "Total Accounts:", adminOverview.body?.metrics?.totalAccounts);
      if (adminOverview.statusCode !== 200) throw new Error("Expected 200 for Admin overview");

      console.log("\n🎉 ALL 3-PANEL PERMISSIONS & FLOW TESTS PASSED!\n");
    } catch (err) {
      console.error("Test Failed:", err);
      process.exit(1);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runPanelTests();
