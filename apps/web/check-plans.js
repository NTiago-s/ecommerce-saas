const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter: adapter,
  log: ["error"],
});

async function checkPlans() {
  try {
    const plans = await prisma.plan.findMany();

    if (plans.length === 0) {
    } else {
      plans.forEach((plan) => {});
    }
  } catch (error) {
    console.error("Error al consultar planes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPlans();
