"use server";

import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 8 && /\d/.test(password) && /[A-Z]/i.test(password);
}

function validatePhone(phone) {
  const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
}

export async function registerUser(formData) {
  const email = formData.get("email")?.toLowerCase().trim();
  const password = formData.get("password");
  const phone = formData.get("phone")?.trim();

  // Validaciones básicas
  if (!email || !password || !phone) {
    throw new Error("Email, contraseña y teléfono son obligatorios");
  }

  // Validar formato de email
  if (!validateEmail(email)) {
    throw new Error("Formato de email inválido");
  }

  // Validar contraseña
  if (!validatePassword(password)) {
    throw new Error(
      "La contraseña debe tener al menos 8 caracteres, incluir un número y una letra",
    );
  }

  // Validar teléfono
  if (!validatePhone(phone)) {
    throw new Error("Formato de teléfono inválido");
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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
        status: "TRIAL",
        trialStartedAt: new Date(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días de trial
      },
    });

    // Retornar usuario con sus relaciones
    return await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        subscriptions: {
          include: {
            stores: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error en registerUser:", error);
    throw new Error(error.message || "Error al registrar usuario");
  }
}
