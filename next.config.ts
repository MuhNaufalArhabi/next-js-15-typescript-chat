import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",        // path to match
        destination: "/auth", // redirect target
        permanent: true,   // or true if this should be a 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;
