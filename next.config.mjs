/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti('./src/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.DOPPLER_ENVIRONMENT === 'prd' ? 'h4fbbawejb.ufs.sh' : 'gw1i78clzu.ufs.sh',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
