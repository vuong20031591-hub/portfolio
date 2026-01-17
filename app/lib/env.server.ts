/**
 * Environment variable helper for Cloudflare Pages
 * 
 * IMPORTANT: On Cloudflare Pages, environment variables are accessed via context.env
 * This helper supports both:
 * - Local dev: process.env (from .env file)
 * - Production: context.env (from Cloudflare Dashboard)
 */

export function getEnv(key: string, env?: Record<string, unknown>): string | undefined {
  // Priority 1: Use env from context (Cloudflare Pages runtime)
  if (env && key in env) {
    const value = env[key];
    return typeof value === 'string' ? value : undefined;
  }
  
  // Priority 2: Fallback to process.env (local dev)
  return process.env[key];
}
