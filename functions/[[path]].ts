// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    // Secrets set via Wrangler CLI are available in context.env
    // NOT in process.env
    console.log("🔍 Functions adapter - context.env.GITHUB_TOKEN exists:", !!context.env.GITHUB_TOKEN);
    
    return {
      cloudflare: {
        env: context.env,
      },
    };
  },
});
