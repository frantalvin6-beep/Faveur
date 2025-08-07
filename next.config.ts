
import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configure fallbacks for Node.js modules
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        async_hooks: false,
        fs: false,
        net: false,
        tls: false,
      };

      // Alias the problematic module to an empty one
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@opentelemetry/context-async-hooks": path.resolve(__dirname, 'empty-module.js'),
      };
    }

    return config;
  },
};

export default nextConfig;
