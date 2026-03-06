import { createPasswordResetToken } from "../../actions/auth-actions/password-reset";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    const result = await createPasswordResetToken(email);

    // TODO: Enviar email real con el token
    // Por ahora, solo logueamos el token para desarrollo
    console.log("Token de recuperación:", result.token);
    console.log("Link de recuperación:", `${process.env.NEXTAUTH_URL}/reset-password?token=${result.token}`);

    return Response.json({
      message: "Email de recuperación enviado",
      // En desarrollo, devolvemos el token para pruebas
      ...(process.env.NODE_ENV === 'development' && { 
        token: result.token,
        resetLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${result.token}`
      })
    });
  } catch (error) {
    console.error("Error en forgot-password API:", error);
    return Response.json(
      { error: error.message || "Error al procesar solicitud" },
      { status: 500 }
    );
  }
}
