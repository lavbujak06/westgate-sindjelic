import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // This is the "magic" line that fixes the hydration mismatch
    styledComponents: true,
  },
  // You can keep your webpack config if you have very custom paths, 
  // but usually Next.js reads tsconfig.json automatically now.
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;