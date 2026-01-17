// Cloudflare Pages Functions adapter for React Router
import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - build output will exist at runtime
import * as build from "../build/server/server.js";

export const onRequest = createPagesFunctionHandler({
  build,
});
