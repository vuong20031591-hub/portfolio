/**
 * Environment variable helper for Cloudflare Pages
 * 
 * IMPORTANT: Cloudflare Pages Secrets (set via Wrangler CLI) are available in context.env
 * NOT in process.env!
 * 
 * See: https://developers.cloudflare.com/pages/functions/bindings/#secrets
 */

export function getEnv(key: string, env?: Record<string, unknown>): string | undefined {
  // Priority 1: Use env from context (Cloudflare Pages Secrets)
  if (env && key in env) {
    const value = env[key];
    return typeof value === 'string' ? value : String(value);
  }
  
  // Priority 2: Fallback to process.env (local dev only)
  return process.env[key];
}
