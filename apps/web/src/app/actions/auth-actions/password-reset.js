"use server";

import crypto from "crypto";
import prisma from "../../../lib/prisma";

export async function createPasswordResetToken(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Eliminar tokens anteriores
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Crear nuevo token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    return { token, email };
  } catch (error) {
    console.error("Error en createPasswordResetToken:", error);
    throw new Error("Error al generar token de recuperación");
  }
}

export async function verifyResetToken(token) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new Error("Token inválido o expirado");
    }

    return verificationToken.identifier; // email
  } catch (error) {
    console.error("Error en verifyResetToken:", error);
    throw new Error("Error al verificar token");
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const email = await verifyResetToken(token);
    
    // Validar nueva contraseña
    if (!newPassword || newPassword.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Eliminar token usado
    await prisma.verificationToken.delete({
      where: { token },
    });

    return true;
  } catch (error) {
    console.error("Error en resetPassword:", error);
    throw new Error(error.message || "Error al restablecer contraseña");
  }
}
