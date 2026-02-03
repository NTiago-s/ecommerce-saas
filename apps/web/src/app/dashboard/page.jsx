import { auth } from "../../auth";
import prisma from "../../lib/prisma";
import DashboardClientPage from "../../components/dashboard/client-page";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
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
    },
  });

  return <DashboardClientPage user={user} />;
}
