// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/index.js";

// Type definition for Cloudflare Pages context
interface CloudflareEnv {
  GITHUB_TOKEN?: string;
  [key: string]: string | undefined;
}

interface CloudflareContext {
  env: CloudflareEnv;
  // Add other Cloudflare context properties if needed
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context: CloudflareContext) => {
    try {
      // Secrets set via Wrangler CLI are available in context.env
      console.log("🔍 Functions adapter - context.env type:", typeof context.env);
      console.log("🔍 Functions adapter - GITHUB_TOKEN exists:", !!context.env?.GITHUB_TOKEN);
      console.log("🔍 Functions adapter - GITHUB_TOKEN value:", context.env?.GITHUB_TOKEN ? "***" + context.env.GITHUB_TOKEN.slice(-4) : "undefined");
      
      return {
        cloudflare: {
          env: context.env || {},
        },
      };
    } catch (error) {
      console.error("❌ Functions adapter error:", error);
      return {
        cloudflare: {
          env: {},
        },
      };
    }
  },
});
