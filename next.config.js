/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize problematic dependencies for server-side builds
      config.externals = [...(config.externals || []), 'ws', 'bufferutil', 'utf-8-validate'];
    }
    
    // Ignore the critical dependency warning for @supabase/realtime-js
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
