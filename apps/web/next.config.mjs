/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    responseLimit: false,
  },
  experimental: {
    serverComponentsExternalPackages: ["@medusajs/js-sdk"],
  },
};

export default nextConfig;
