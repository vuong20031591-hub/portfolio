// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";
import type { AppLoadContext } from "react-router";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context): AppLoadContext => {
    return {
      cloudflare: {
        env: context.env,
        cf: context.request.cf,
        ctx: context.context,
      },
    };
  },
});
