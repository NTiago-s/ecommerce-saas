import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";

// Extraer DATABASE_URL del archivo .env
const envPath = path.resolve(__dirname, '..', '.env');
let connectionString = "postgresql://postgres:H5C3V9M4Z1@localhost:5432/ecommerce-saas";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (dbUrlMatch) {
    connectionString = dbUrlMatch[1];
  }
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

async function main() {
  console.log("🌱 Iniciando seeding de planes para Mercado Pago...");

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
        features: plan.features as any,
      },
    });
  }

  console.log("✅ Planes creados exitosamente en la DB.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
