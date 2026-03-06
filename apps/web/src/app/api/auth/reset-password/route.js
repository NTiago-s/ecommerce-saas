import { resetPassword } from "../../actions/auth-actions/password-reset";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        { error: "Token y contraseña son requeridos" },
        { status: 400 }
      );
    }

    await resetPassword(token, password);

    return Response.json({
      message: "Contraseña restablecida correctamente"
    });
  } catch (error) {
    console.error("Error en reset-password API:", error);
    return Response.json(
      { error: error.message || "Error al procesar solicitud" },
      { status: 500 }
    );
  }
}
