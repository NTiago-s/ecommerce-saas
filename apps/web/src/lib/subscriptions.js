const ACCESSIBLE_STATUSES = new Set(["ACTIVE", "TRIAL"]);

export function getPrimarySubscription(subscriptions = []) {
  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return null;
  }

  const ordered = subscriptions
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  const active = ordered.find((subscription) =>
    ACCESSIBLE_STATUSES.has(subscription?.status),
  );

  return active ?? ordered[0] ?? null;
}

export function hasStoreAccess(subscription) {
  if (!subscription?.planId && !subscription?.plan?.id) {
    return false;
  }

  return ACCESSIBLE_STATUSES.has(subscription?.status);
}

export function subscriptionStatusLabel(status) {
  const labels = {
    TRIAL: "Prueba",
    ACTIVE: "Activo",
    PAST_DUE: "Vencido",
    CANCELED: "Cancelado",
    INCOMPLETE: "Pendiente",
  };

  return labels[status] || status || "Sin plan";
}
