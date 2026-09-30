import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path.ts";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
};

export default nextConfig;
