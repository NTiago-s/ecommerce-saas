import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

// Extraer DATABASE_URL del archivo .env
const envPath = path.resolve(__dirname, '..', '.env');
let connectionString = "postgresql://postgres:H5C3V9M4Z1@localhost:5432/ecommerce-saas";
let envContent = "";

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (dbUrlMatch) {
    connectionString = dbUrlMatch[1];
  }
}

function getEnvVar(key: string) {
  const fromProcess = process.env[key];
  if (fromProcess && fromProcess.trim()) return fromProcess.trim();

  if (!envContent) return undefined;

  const quoted = envContent.match(new RegExp(`^${key}=\"([^\"]+)\"$`, "m"));
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

  const plans = [
    {
      name: "Plan Básico",
      price: 5000, // Ejemplo: 5000 ARS/MXN al mes
      currency: "ARS",
      stripePriceId: "mp_plan_basico", // Usaremos este campo como identificador interno/MP
      maxStores: 1,
      maxProducts: 20,
      maxStaff: 1,
      features: {
        ventas: "Hasta 20 productos",
        soporte: "Comunidad",
        personalizacion: "Básica",
      },
    },
    {
      name: "Plan Emprendedor",
      price: 12000,
      currency: "ARS",
      stripePriceId: "mp_plan_emprendedor",
      maxStores: 2,
      maxProducts: 100,
      maxStaff: 3,
      features: {
        ventas: "Hasta 100 productos",
        soporte: "Email prioritario",
        personalizacion: "Avanzada",
        analytics: "Panel de control",
      },
    },
    {
      name: "Plan Corporativo",
      price: 35000,
      currency: "ARS",
      stripePriceId: "mp_plan_corporativo",
      maxStores: 5,
      maxProducts: null, // Ilimitado
      maxStaff: 10,
      features: {
        ventas: "Productos ilimitados",
        soporte: "WhatsApp 24/7",
        personalizacion: "Total",
        analytics: "Reportes exportables",
      },
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { stripePriceId: plan.stripePriceId },
      update: {
        name: plan.name,
        price: plan.price,
        maxStores: plan.maxStores,
      },
      create: {
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        stripePriceId: plan.stripePriceId, // Identificador para matchear con MP
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
      "[seed] ADMIN_EMAIL y/o ADMIN_PASSWORD no configurados. No se creará el usuario admin.",
    );
  }

  const hashedUserPassword = await bcrypt.hash(userPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      password: hashedUserPassword,
      phone: userPhone,
      role: "USER",
      status: "ACTIVE",
    },
    create: {
      email: userEmail,
      password: hashedUserPassword,
      phone: userPhone,
      role: "USER",
      status: "ACTIVE",
    },
  });

  const defaultPlan = await prisma.plan.findUnique({
    where: { stripePriceId: "mp_plan_basico" },
    select: { id: true },
  });

  if (!defaultPlan) {
    throw new Error(
      "[seed] No se encontró el plan por defecto (stripePriceId=mp_plan_basico).",
    );
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: { in: ["ACTIVE", "TRIAL"] },
    },
    select: { id: true },
  });

  if (existingSubscription) {
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        planId: defaultPlan.id,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: defaultPlan.id,
        status: "ACTIVE",
        trialStartedAt: new Date(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
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
