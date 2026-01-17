/**
 * Environment variable helper for Cloudflare Pages
 * 
 * IMPORTANT: Cloudflare Pages environment variables are injected into process.env
 * NOT into context.env (which is for bindings like KV, R2, D1)
 * 
 * See: https://developers.cloudflare.com/pages/functions/bindings/#environment-variables
 */

export function getEnv(key: string, _env?: Record<string, unknown>): string | undefined {
  // Cloudflare Pages injects environment variables into process.env
  // This works because we have nodejs_compat flag in wrangler.toml
  return process.env[key];
}
