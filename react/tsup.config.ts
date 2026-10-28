import { defineConfig } from "tsup"
import path from "node:path"

// Compila o código gerado em .generated/ (registro shadcn com classes prefixadas "fd:")
const registry = path.resolve(__dirname, ".generated/registry")

export default defineConfig({
  entry: [".generated/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: { entry: ".generated/index.ts" },
  tsconfig: "tsconfig.json",
  clean: false,
  sourcemap: true,
  treeshake: false,
  banner: { js: '"use client";' },
  external: [/^react($|\/)/, /^react-dom($|\/)/, /^radix-ui/, /^@phosphor-icons/, /^@tanstack/, "class-variance-authority", "clsx", "tailwind-merge", "react-day-picker", "sonner", "input-otp"],
  esbuildOptions(options) {
    options.alias = {
      "@/registry": registry,
      "@/lib": path.join(registry, "futuredata/lib"),
      "@/hooks": path.join(registry, "futuredata/hooks"),
    }
  },
})
