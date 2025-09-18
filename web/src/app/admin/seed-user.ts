import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin12345";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, role: "ADMIN", name: "Администратор" },
    update: {},
  });
}


