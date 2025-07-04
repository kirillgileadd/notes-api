import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Создание пользователей с ролями
  const roles = ["admin", "user", "manager"] as const;
  for (const role of roles) {
    const phone = `+7000000000${roles.indexOf(role)}`;
    await prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone, role },
    });
  }
  // Можно добавить создание тестовых заметок, тегов и т.д.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
