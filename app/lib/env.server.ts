/**
 * Environment variable helper for Cloudflare Pages
 * Simple approach: just use process.env (works in dev and production)
 */

export function getEnv(key: string): string | undefined {
  return process.env[key];
}
