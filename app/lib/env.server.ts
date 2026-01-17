/**
 * Environment variable helper for Cloudflare Pages
 * 
 * IMPORTANT: On Cloudflare Pages, environment variables are accessed via context.env
 * This helper supports both:
 * - Local dev: process.env (from .env file)
 * - Production: context.env (from Cloudflare Dashboard) - passed as plain object
 */

export function getEnv(key: string, env?: Record<string, unknown>): string | undefined {
  // Priority 1: Use env from context (Cloudflare Pages runtime)
  if (env) {
    // Direct property access (works with Proxy objects)
    const value = env[key];
    if (value !== undefined) {
      return typeof value === 'string' ? value : String(value);
    }
  }
  
  // Priority 2: Fallback to process.env (local dev)
  return process.env[key];
}
