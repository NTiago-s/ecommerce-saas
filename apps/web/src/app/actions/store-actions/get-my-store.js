// app/actions/store-actions/get-my-store.js
"use server";
import prisma from "../../../lib/prisma";
import { auth } from "../../../auth";

export async function getMyActiveStore() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // Buscamos la primera tienda del usuario
  const store = await prisma.store.findFirst({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
      name: true,
      medusaSalesChannelId: true,
      medusaStoreId: true,
    },
  });

  return store;
}

export async function getMyStores() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return [];

  const stores = await prisma.store.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
      name: true,
      medusaSalesChannelId: true,
      medusaStoreId: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return stores;
}
