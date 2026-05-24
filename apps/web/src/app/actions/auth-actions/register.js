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

  if (!email || !password || !phone) {
    throw new Error("Email, contrasena y telefono son obligatorios");
  }

  if (!validateEmail(email)) {
    throw new Error("Formato de email invalido");
  }

  if (!validatePassword(password)) {
    throw new Error(
      "La contrasena debe tener al menos 8 caracteres, incluir un numero y una letra",
    );
  }

  if (!validatePhone(phone)) {
    throw new Error("Formato de telefono invalido");
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
      },
    });

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
