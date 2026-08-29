const bcrypt = require("bcryptjs");
const prisma = require("./lib/prisma");

async function seedAdmin() {
  const email = "chiru@gmail.com";
  const rawPassword = "chiru@6595";
  const name = "Chiru (Platform Admin)";
  const role = "ADMIN";

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    let user;
    if (existing) {
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name,
          role,
          passwordHash,
          isEmailVerified: true
        }
      });
      console.log(`✓ Updated existing account ${email} to ADMIN role with new password!`);
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          role,
          isEmailVerified: true
        }
      });
      console.log(`✓ Created new ADMIN account: ${email}`);
    }

    console.log("==========================================");
    console.log("  ADMIN CREDENTIALS PROVISIONED           ");
    console.log("==========================================");
    console.log(`Email:    ${user.email}`);
    console.log(`Password: ${rawPassword}`);
    console.log(`Role:     ${user.role}`);
    console.log("==========================================");
  } catch (error) {
    console.error("Failed to seed admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
