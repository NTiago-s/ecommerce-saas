export async function getAdminToken() {
  const baseUrl = process.env.MEDUSA_BACKEND_URL;
  const secretKey = process.env.MEDUSA_ADMIN_SECRET_KEY;
  const email = process.env.MEDUSA_ADMIN_EMAIL;
  const password = process.env.MEDUSA_ADMIN_PASSWORD;

  const res = await fetch(`${baseUrl}/auth/user/emailpass`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-medusa-access-token": secretKey,
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error("No se pudo autenticar al admin automáticamente");

  return data.token;
}
