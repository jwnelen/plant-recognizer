/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@plant-recognizer/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.plantnet.org",
      },
      {
        protocol: "https",
        hostname: "**.convex.cloud",
      },
    ],
  },
};

module.exports = nextConfig;
