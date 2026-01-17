/**
 * Environment variable helper for Cloudflare Pages
 * Handles both Node.js (dev) and Cloudflare (production) environments
 */

// Type for Cloudflare env
interface CloudflareEnv {
  GITHUB_TOKEN?: string;
  R2_PUBLIC_URL?: string;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  [key: string]: string | undefined;
}

// Global store for current request context
let currentContext: { env: CloudflareEnv } | null = null;

export function setRequestContext(context: { env: CloudflareEnv }) {
  currentContext = context;
}

export function clearRequestContext() {
  currentContext = null;
}

export function getEnv(key: string): string | undefined {
  // Try Cloudflare context first (production)
  if (currentContext?.env?.[key]) {
    return currentContext.env[key];
  }
  
  // Fallback to process.env (development)
  return process.env[key];
}
