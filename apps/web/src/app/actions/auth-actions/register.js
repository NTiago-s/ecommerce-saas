"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

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

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
}
