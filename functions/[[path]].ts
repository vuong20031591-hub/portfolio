// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";
import type { AppLoadContext } from "react-router";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context): AppLoadContext => {
    // Bind Cloudflare environment variables to process.env
    // This makes them accessible in server-side code
    if (context.env) {
      Object.keys(context.env).forEach((key) => {
        process.env[key] = context.env[key];
      });
    }
    
    return {
      cloudflare: context,
    };
  },
});
