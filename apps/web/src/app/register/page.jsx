import { auth } from "../../auth";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const session = await auth();

  // Si ya está logueado → afuera
  if (session) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
