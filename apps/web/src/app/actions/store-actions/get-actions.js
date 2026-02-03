"use server";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL;
import { getAdminToken } from "../../../lib/get-admin-token";

export async function getRegions() {
  const token = await getAdminToken();

  const res = await fetch(`${MEDUSA_URL}/admin/regions`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return data.regions || [];
}
