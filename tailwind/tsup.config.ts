import { defineConfig } from "tsup"
import path from "node:path"

const registry = path.resolve(__dirname, "../shadcn/registry")

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
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
