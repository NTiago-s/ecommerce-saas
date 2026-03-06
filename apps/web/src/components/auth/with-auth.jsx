"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { data: session, status } = useSession();

    useEffect(() => {
      if (status === "loading") return; // Esperar a que cargue la sesión
      
      if (!session) {
        redirect("/login");
      }
    }, [session, status]);

    if (status === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!session) {
      return null; // Redirigirá al login
    }

    return <Component {...props} session={session} />;
  };
}

export function withAdminAuth(Component) {
  return function AdminAuthenticatedComponent(props) {
    const { data: session, status } = useSession();

    useEffect(() => {
      if (status === "loading") return; // Esperar a que cargue la sesión
      
      if (!session) {
        redirect("/login");
      }
      
      if (session.user?.role !== "ADMIN") {
        redirect("/dashboard");
      }
    }, [session, status]);

    if (status === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!session || session.user?.role !== "ADMIN") {
      return null; // Redirigirá
    }

    return <Component {...props} session={session} />;
  };
}
