import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()], // so "@/..." imports resolve like in Next.js
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
