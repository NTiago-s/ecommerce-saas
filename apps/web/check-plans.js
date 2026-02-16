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
    console.log("Planes existentes:", plans);

    if (plans.length === 0) {
      console.log("No hay planes en la base de datos");
    } else {
      console.log(`Se encontraron ${plans.length} planes`);
      plans.forEach((plan) => {
        console.log(
          `- ID: ${plan.id}, Nombre: ${plan.name}, Precio: ${plan.price}`,
        );
      });
    }
  } catch (error) {
    console.error("Error al consultar planes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPlans();
