// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    // Debug: Check if environment variables are in process.env
    console.log("🔍 Functions adapter - process.env.GITHUB_TOKEN exists:", !!process.env.GITHUB_TOKEN);
    
    return {
      cloudflare: {
        env: context.env,
      },
    };
  },
});
