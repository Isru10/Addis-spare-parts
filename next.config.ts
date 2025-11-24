import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: '**',
      },

       {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
