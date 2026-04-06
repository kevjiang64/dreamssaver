import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid wrong root when another package-lock.json exists higher in the tree (e.g. user home).
    root: projectRoot,
  },
};

export default nextConfig;
