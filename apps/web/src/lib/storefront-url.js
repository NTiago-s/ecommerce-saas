function storefrontBaseUrl() {
  return (
    String(process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "").trim() ||
    String(process.env.STOREFRONT_URL ?? "").trim() ||
    "http://localhost:8000"
  ).replace(/\/$/, "");
}

function defaultCountryCode() {
  return (
    String(process.env.NEXT_PUBLIC_STOREFRONT_DEFAULT_COUNTRY ?? "").trim() ||
    String(process.env.NEXT_PUBLIC_DEFAULT_REGION ?? "").trim() ||
    "us"
  ).toLowerCase();
}

export function buildStorefrontPath(slug, countryCode) {
  const normalizedSlug = String(slug ?? "").trim().toLowerCase();
  const normalizedCountry = String(countryCode ?? "")
    .trim()
    .toLowerCase();

  if (!normalizedCountry) {
    return `/s/${normalizedSlug}`;
  }

  return `/${normalizedCountry}/s/${normalizedSlug}`;
}

export function buildStorefrontUrl(slug, countryCode) {
  return `${storefrontBaseUrl()}${buildStorefrontPath(slug, countryCode)}`;
}
