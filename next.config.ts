import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/**")],
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/scholarships",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
