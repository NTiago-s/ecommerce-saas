import { NextResponse } from "next/server";
import { auth } from "./src/auth";

export default async function middleware(req) {
  const { nextUrl } = req;
  const session = await auth();

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicPath = publicPaths.includes(nextUrl.pathname);

  // Si el usuario está autenticado y trata de acceder a rutas públicas
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Rutas protegidas que requieren autenticación
  const protectedPaths = ["/dashboard", "/admin", "/api/auth"];
  const isProtectedPath = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path),
  );

  // Si el usuario no está autenticado y trata de acceder a rutas protegidas
  if (!session && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Rutas de admin que requieren rol de administrador
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
