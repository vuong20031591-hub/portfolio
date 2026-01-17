// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    // IMPORTANT: In Cloudflare Pages, environment variables are accessed directly from context.env
    // NOT from context.cloudflare.env
    // See: https://developers.cloudflare.com/pages/functions/bindings/#environment-variables
    
    try {
      // Safe logging
      const envKeys = context.env ? Object.keys(context.env) : [];
      console.log("🔍 Functions adapter - env keys:", envKeys.join(", "));
      console.log("🔍 Functions adapter - GITHUB_TOKEN exists:", context.env && "GITHUB_TOKEN" in context.env);
    } catch (error) {
      console.error("Error logging env:", error);
    }
    
    return {
      cloudflare: {
        // Pass the entire env object
        env: context.env,
      },
    };
  },
});
