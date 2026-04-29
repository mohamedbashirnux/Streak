import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  turbopack: {
    // Empty turbopack config to silence the warning
    // Turbopack handles server-side modules correctly by default
  },
};

export default nextConfig;
