const bcrypt = require("bcryptjs");
const prisma = require("./lib/prisma");

async function cleanDatabase() {
  console.log("🧹 Cleaning mock demo data from SQLite database...");

  try {
    const deletedCheckIns = await prisma.checkIn.deleteMany({});
    console.log(`✓ Cleared ${deletedCheckIns.count} old check-in records.`);

    // Provision real ADMIN account in SQLite DB
    const email = "chiru@gmail.com";
    const rawPassword = "chiru@6595";
    const name = "Chiru (Platform Admin)";
    const role = "ADMIN";

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { name, role, passwordHash, isEmailVerified: true }
      });
      console.log(`✓ Updated ADMIN account: ${email}`);
    } else {
      await prisma.user.create({
        data: { email, name, passwordHash, role, isEmailVerified: true }
      });
      console.log(`✓ Created new ADMIN account: ${email}`);
    }

    console.log("==========================================");
    console.log("  REAL SQLITE DATABASE READY              ");
    console.log("==========================================");
    console.log(`Admin Account: ${email}`);
    console.log(`Password:      ${rawPassword}`);
    console.log("==========================================");
  } catch (err) {
    console.error("Database Clean Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
