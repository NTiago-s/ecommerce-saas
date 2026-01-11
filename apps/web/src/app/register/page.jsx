import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const session = await auth();

  // Si ya está logueado → afuera
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Crear cuenta</h1>
      <RegisterForm />
    </div>
  );
}
