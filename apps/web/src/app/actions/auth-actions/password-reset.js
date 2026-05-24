"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

async function sendResetEmail({ email, resetLink }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESET_PASSWORD_EMAIL_FROM;

  if (!apiKey || !from) {
    return { sent: false, reason: "Email provider is not configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Restablece tu contraseña",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
          <h1 style="font-size:20px">Restablece tu contraseña</h1>
          <p>Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
          <p>
            <a href="${resetLink}" style="display:inline-block;background:#2563eb;color:white;padding:12px 16px;border-radius:8px;text-decoration:none;font-weight:700">
              Crear nueva contraseña
            </a>
          </p>
          <p>Este enlace vence en 1 hora. Si no solicitaste el cambio, puedes ignorar este email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "No se pudo enviar el email");
  }

  return { sent: true };
}

export async function createPasswordResetToken(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("Email es requerido");
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, email: true },
  });

  if (!user) {
    return { sent: false, resetLink: null };
  }

  await prisma.verificationToken.deleteMany({
    where: { identifier: normalizedEmail },
  });

  const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.verificationToken.create({
    data: {
      identifier: normalizedEmail,
      token: hashedToken,
      expires,
    },
  });

  const resetLink = `${getBaseUrl()}/reset-password?token=${token}`;
  const delivery = await sendResetEmail({ email: normalizedEmail, resetLink });

  return {
    email: normalizedEmail,
    resetLink,
    sent: delivery.sent,
  };
}

export async function verifyResetToken(token) {
  const rawToken = String(token || "").trim();

  if (!rawToken) {
    throw new Error("Token requerido");
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token: hashToken(rawToken) },
  });

  if (!verificationToken) {
    throw new Error("Token inválido o expirado");
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });
    throw new Error("Token inválido o expirado");
  }

  return verificationToken.identifier;
}

export async function resetPassword(token, newPassword) {
  const email = await verifyResetToken(token);

  if (!newPassword || newPassword.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const hashedToken = hashToken(token);

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    }),
    prisma.verificationToken.delete({
      where: { token: hashedToken },
    }),
  ]);

  return true;
}
