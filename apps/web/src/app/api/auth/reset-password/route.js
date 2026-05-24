import {
  resetPassword,
  verifyResetToken,
} from "../../../actions/auth-actions/password-reset";

export async function GET(request) {
  try {
    const token = new URL(request.url).searchParams.get("token");

    await verifyResetToken(token);

    return Response.json({ valid: true });
  } catch {
    return Response.json(
      { valid: false, error: "El enlace no es válido o expiró" },
      { status: 400 },
    );
  }
}

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        { error: "Token y contraseña son requeridos" },
        { status: 400 },
      );
    }

    await resetPassword(token, password);

    return Response.json({
      message: "Contraseña restablecida correctamente",
    });
  } catch (error) {
    console.error("Error en reset-password API:", error);
    return Response.json(
      { error: error.message || "Error al procesar solicitud" },
      { status: 400 },
    );
  }
}
