import { auth } from "../../auth";
import prisma from "../../lib/prisma";
import DashboardClientPage from "../../components/dashboard/client-page";
import { redirect } from "next/navigation";
import { syncMercadoPagoSubscriptionByPreapprovalId } from "../../lib/mercadopago-subscription";

export const metadata = {
  title: "Dashboard | Codeluxe Store",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage({ searchParams }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const preapprovalId = String(
    resolvedSearchParams?.preapproval_id ??
      resolvedSearchParams?.preapprovalId ??
      "",
  ).trim();

  if (preapprovalId) {
    try {
      await syncMercadoPagoSubscriptionByPreapprovalId(preapprovalId);
    } catch (error) {
      console.error("Error syncing Mercado Pago subscription on dashboard:", error);
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      stores: true,
      sessions: true,
      accounts: true,
      storeStaffs: true,
      createdAt: true,
      subscriptions: {
        include: {
          plan: true,
        },
      },
    },
  });

  const plans = await prisma.plan.findMany({
    where: {
      name: {
        in: ["Prueba", "Basico", "Intermedio", "Profesional"],
      },
    },
    orderBy: { price: "asc" },
  });

  return <DashboardClientPage user={user} plans={plans} />;
}
