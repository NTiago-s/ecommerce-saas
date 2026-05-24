import prisma from "./prisma";
import { mpGetPreapproval } from "./mercadopago";

export function mapMpStatusToSubscriptionStatus(mpStatus) {
  const status = String(mpStatus ?? "").toLowerCase();

  if (status === "authorized") return "ACTIVE";
  if (status === "cancelled" || status === "canceled") return "CANCELED";
  if (status === "paused") return "PAST_DUE";
  if (status === "pending") return "INCOMPLETE";
  return "INCOMPLETE";
}

export async function syncMercadoPagoSubscriptionByPreapprovalId(preapprovalId) {
  const normalizedId = String(preapprovalId ?? "").trim();
  if (!normalizedId) return null;

  const preapproval = await mpGetPreapproval(normalizedId);
  const externalReference = String(preapproval?.external_reference ?? "").trim();
  const subscriptionId = externalReference.startsWith("sub_")
    ? externalReference.slice("sub_".length)
    : null;

  const data = {
    status: mapMpStatusToSubscriptionStatus(preapproval?.status),
    mpPreapprovalId: String(preapproval?.id ?? normalizedId),
    mpPayerId: preapproval?.payer_id ? String(preapproval.payer_id) : null,
    currentPeriodEnd: preapproval?.auto_recurring?.end_date
      ? new Date(preapproval.auto_recurring.end_date)
      : null,
  };

  if (subscriptionId) {
    await prisma.subscription.updateMany({
      where: { id: subscriptionId },
      data,
    });
  } else {
    await prisma.subscription.updateMany({
      where: { mpPreapprovalId: String(preapproval?.id ?? normalizedId) },
      data,
    });
  }

  return {
    subscriptionId,
    preapproval,
    status: data.status,
  };
}
