/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      'mongoose',
      '@react-email/components',
      '@react-email/tailwind',
    ],
    serverActions: true,
  },
};

module.exports = nextConfig;
