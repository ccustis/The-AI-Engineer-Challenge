import type { NextConfig } from "next";

/**
 * Local development talks to the FastAPI server through a same-origin proxy.
 * Production builds omit the proxy so Vercel can route `/api/*` to the
 * Python service on the shared domain. See the root `vercel.json`.
 */
const localApiOrigin =
  process.env.NODE_ENV === "production"
    ? undefined
    : (process.env.API_PROXY_ORIGIN ?? "http://127.0.0.1:8000");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    if (!localApiOrigin) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${localApiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
