"use server";

import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const phone = formData.get("phone");

  if (!email || !password) {
    throw new Error("Email y password son obligatorios");
  }

  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario primero
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      phone,
    },
  });

  // Crear suscripción asociada al usuario
  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      planId: "cmlp6mj3h000124kgx7e14dl7",
      status: "ACTIVE",
      trialStartedAt: new Date(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días de trial
    },
  });

  // Retornar usuario con sus relaciones
  return await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      subscriptions: {
        include: {
          stores: true,
        },
      },
    },
  });
}
