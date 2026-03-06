export const runtime = "nodejs";

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email y contraseña son requeridos");
          }

          const email = credentials.email.toLowerCase().trim();

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              role: true,
              status: true,
              phone: true,
              createdAt: true,
            },
          });

          if (!user) {
            throw new Error("Usuario no encontrado");
          }

          if (user.status !== "ACTIVE") {
            throw new Error("Usuario suspendido. Contacta al administrador");
          }

          if (!user.password) {
            throw new Error("Usuario sin contraseña configurada");
          }

          const valid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!valid) {
            throw new Error("Contraseña incorrecta");
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            phone: user.phone,
          };
        } catch (error) {
          console.error("Error en authorize:", error.message);
          throw new Error(error.message || "Error de autenticación");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.phone = token.phone;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.status = user.status;
        token.phone = user.phone;
      }
      return token;
    },
  },
});
