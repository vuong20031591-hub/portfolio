// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/index.js";

// Type definition for Cloudflare environment
interface CloudflareEnv {
  GITHUB_TOKEN?: string;
  [key: string]: string | undefined;
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: ({ context }) => {
    try {
      // React Router wraps Cloudflare context in args.context.cloudflare
      // Secrets from Dashboard are available in context.cloudflare.env
      const env = context.cloudflare.env as CloudflareEnv;
      
      return {
        cloudflare: {
          env: env || {},
        },
      };
    } catch (error) {
      console.error("Functions adapter error:", error);
      return {
        cloudflare: {
          env: {},
        },
      };
    }
  },
});
