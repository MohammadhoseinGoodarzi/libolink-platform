import path from 'node:path';
import type { NextConfig } from 'next';

// Next 16 removed the built-in ESLint integration, so `eslint.ignoreDuringBuilds`
// is no longer needed — builds never lint. `turbopack.root` pins the workspace
// root to this monorepo so Next never infers a stray lockfile higher up the tree.
const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '..', '..'),
  },
};

export default nextConfig;
