import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icyhmuyqnzcqfgswdytw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  }
};

export default nextConfig;
