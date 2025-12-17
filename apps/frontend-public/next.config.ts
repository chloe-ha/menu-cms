import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [new URL('https://menu-cms-test.s3.eu-north-1.amazonaws.com/restaurants/images/**')],
  }
};

export default nextConfig;
