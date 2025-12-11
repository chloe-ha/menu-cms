import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://offloadmedia.feverup.com/**"),
      new URL("https://www.healthyfoodcreation.fr/**"),
    ]
  }
};

export default nextConfig;
