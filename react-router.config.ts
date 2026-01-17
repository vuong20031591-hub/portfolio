import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  buildDirectory: "build",
  
  future: {
    unstable_optimizeDeps: true,
  },
} satisfies Config;
