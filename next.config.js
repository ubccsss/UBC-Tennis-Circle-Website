/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
    serverActions: true,
  },
};

module.exports = nextConfig;
