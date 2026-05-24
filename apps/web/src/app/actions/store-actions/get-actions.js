"use server";

import { callSaasApi } from "../../../lib/saas-api";

export async function getRegions() {
  const data = await callSaasApi("/saas/regions", {
    method: "GET",
  });

  return data.regions || [];
}
