// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    // Pass Cloudflare env directly to context
    // Loaders can access via context.cloudflare.env
    return {
      cloudflare: {
        env: context.env,
      },
    };
  },
});
