import { config } from "dotenv";
config();

import { auth } from "../lib/auth";
import prisma from "../lib/db";

async function main() {
  // Add super admin user
  const email = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SUPER_ADMIN_PASSWORD || "admin123";
  const name = process.env.SUPER_ADMIN_NAME || "Admin";

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });
  console.log("Super Admin seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
