import { createPasswordResetToken } from "../../../actions/auth-actions/password-reset";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email es requerido" }, { status: 400 });
    }

    const result = await createPasswordResetToken(email);

    return Response.json({
      message:
        "Si existe una cuenta con ese email, enviaremos instrucciones para restablecer la contraseña.",
      emailSent: result.sent,
      ...(process.env.NODE_ENV === "development" &&
        result.resetLink && {
          resetLink: result.resetLink,
        }),
    });
  } catch (error) {
    console.error("Error en forgot-password API:", error);
    return Response.json(
      { error: error.message || "Error al procesar solicitud" },
      { status: 500 },
    );
  }
}
