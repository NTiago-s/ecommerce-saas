import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

// Extraer DATABASE_URL del archivo .env (si existe)
const envPath = path.resolve(__dirname, "..", ".env");
let connectionString =
  "postgresql://postgres:password@localhost:5432/ecommerce-saas";
let envContent = "";

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (dbUrlMatch) {
    connectionString = dbUrlMatch[1];
  }
}

function getEnvVar(key: string) {
  const fromProcess = process.env[key];
  if (fromProcess && fromProcess.trim()) return fromProcess.trim();

  if (!envContent) return undefined;

  const quoted = envContent.match(new RegExp(`^${key}="([^"]+)"$`, "m"));
  if (quoted?.[1]) return quoted[1].trim();

  const unquoted = envContent.match(new RegExp(`^${key}=([^\n\r]+)$`, "m"));
  if (unquoted?.[1]) return unquoted[1].trim();

  return undefined;
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

async function main() {
  // SaaS plans (price in USD; MP charges ARS after FX conversion in runtime)
  const plans = [
    {
      name: "Prueba",
      price: 0,
      currency: "usd",
      stripePriceId: "plan_prueba",
      maxStores: 1,
      maxProducts: 10,
      maxStaff: 1,
      features: {
        tier: "free",
        stores: 1,
        products_per_store: 10,
      },
    },
    {
      name: "Basico",
      price: 15,
      currency: "usd",
      stripePriceId: "plan_basico",
      maxStores: 1,
      maxProducts: 30,
      maxStaff: 2,
      features: {
        tier: "basic",
        stores: 1,
        products_per_store: 30,
      },
    },
    {
      name: "Intermedio",
      price: 33,
      currency: "usd",
      stripePriceId: "plan_intermedio",
      maxStores: 3,
      maxProducts: 40,
      maxStaff: 5,
      features: {
        tier: "intermediate",
        stores: 3,
        products_per_store: 40,
      },
    },
    {
      name: "Profesional",
      price: 100,
      currency: "usd",
      stripePriceId: "plan_profesional",
      maxStores: 5,
      maxProducts: null,
      maxStaff: 10,
      features: {
        tier: "pro",
        stores: 5,
        products_per_store: "unlimited",
      },
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { stripePriceId: plan.stripePriceId },
      update: {
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        maxStores: plan.maxStores,
        maxProducts: plan.maxProducts,
        maxStaff: plan.maxStaff,
        features: plan.features as Prisma.InputJsonValue,
      },
      create: {
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        stripePriceId: plan.stripePriceId,
        maxStores: plan.maxStores,
        maxProducts: plan.maxProducts,
        maxStaff: plan.maxStaff,
        features: plan.features as Prisma.InputJsonValue,
      },
    });
  }

  const adminEmail = getEnvVar("ADMIN_EMAIL");
  const adminPassword = getEnvVar("ADMIN_PASSWORD");
  const adminPhone = getEnvVar("ADMIN_PHONE");

  const userEmail = getEnvVar("USER_EMAIL");
  const userPassword = getEnvVar("USER_PASSWORD");
  const userPhone = getEnvVar("USER_PHONE");

  // Admin user (optional)
  if (adminEmail && adminPassword) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        phone: adminPhone ?? null,
        role: "ADMIN",
        status: "ACTIVE",
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        phone: adminPhone ?? null,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
  } else {
    console.warn(
      "[seed] ADMIN_EMAIL y/o ADMIN_PASSWORD no configurados. No se creara el admin.",
    );
  }

  // Primary user + subscription (required)
  if (!userEmail || !userPassword) {
    throw new Error(
      "[seed] USER_EMAIL y USER_PASSWORD son requeridos para crear el usuario base.",
    );
  }

  const hashedUserPassword = await bcrypt.hash(userPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      password: hashedUserPassword,
      phone: userPhone ?? null,
      role: "USER",
      status: "ACTIVE",
    },
    create: {
      email: userEmail,
      password: hashedUserPassword,
      phone: userPhone ?? null,
      role: "USER",
      status: "ACTIVE",
    },
  });

  const defaultPlan = await prisma.plan.findUnique({
    where: { stripePriceId: "plan_prueba" },
    select: { id: true },
  });

  if (!defaultPlan) {
    throw new Error("[seed] No se encontro el plan por defecto (plan_prueba).");
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (existingSubscription) {
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        planId: defaultPlan.id,
        status: "ACTIVE",
        trialStartedAt: null,
        trialEndsAt: null,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: defaultPlan.id,
        status: "ACTIVE",
        trialStartedAt: null,
        trialEndsAt: null,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

