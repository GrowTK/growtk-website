import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The trade pages were replaced by the seven industries in content/industry-pages.ts. */
  async redirects() {
    return ["hvac", "plumbing", "electrical", "roofing", "railing-fencing", "landscaping", "pest-control", "cleaning"].map((slug) => ({
      source: `/industries/${slug}`,
      destination: "/industries",
      permanent: true,
    }));
  },
  experimental: {
    webpackMemoryOptimizations: true,
    preloadEntriesOnStart: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
    // Next 16 requires every `quality` prop value used in the app to be listed here.
    qualities: [60, 65, 66, 68, 70, 72, 75, 80],
  },
};

export default nextConfig;
