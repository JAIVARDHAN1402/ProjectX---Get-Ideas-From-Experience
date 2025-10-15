import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com", // GitHub avatars
      "lh3.googleusercontent.com",     // Google profile images
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgs.search.brave.com", // agar aur external images hain
      },
    ],
  },
};

export default nextConfig;
