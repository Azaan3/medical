import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    outputFileTracingIncludes: {
      "/api/assess": ["./data/**/*"],
      "/api/knowledge/status": ["./data/**/*"],
      "/api/knowledge/reindex": ["./data/**/*"],
    },
  },
};

export default nextConfig;
