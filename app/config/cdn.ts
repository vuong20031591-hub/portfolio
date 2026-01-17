/**
 * CDN Configuration
 * Manages URLs for static assets hosted on Cloudflare R2
 */

// Check if we're in browser or server
const isBrowser = typeof window !== 'undefined';

// Get R2 public URL from environment
// In production, this should be your custom domain: https://cdn.yourdomain.com
// In development, use local public folder
const R2_PUBLIC_URL = isBrowser 
  ? (window as any).__R2_PUBLIC_URL__ || ''
  : process.env.R2_PUBLIC_URL || '';

/**
 * CDN Configuration
 */
export const CDN_CONFIG = {
  /**
   * R2 public URL
   * Set via R2_PUBLIC_URL environment variable
   */
  R2_PUBLIC_URL,

  /**
   * Whether to use R2 CDN or local public folder
   * Enable this after uploading images to R2
   */
  USE_R2_CDN: !!R2_PUBLIC_URL,

  /**
   * Spotlight frames base path
   */
  SPOTLIGHT_BASE_PATH: '/spotlight',

  /**
   * Get full URL for a spotlight frame
   * @param frameNumber - Frame number (1-272)
   * @returns Full URL to the frame image
   */
  getSpotlightFrameUrl(frameNumber: number): string {
    const paddedNumber = String(frameNumber).padStart(3, '0');
    const filename = `spotlight-frame-${paddedNumber}.webp`;

    if (this.USE_R2_CDN) {
      return `${this.R2_PUBLIC_URL}${this.SPOTLIGHT_BASE_PATH}/${filename}`;
    } else {
      return `/images/news/${filename}`;
    }
  },
};

/**
 * Helper to inject R2_PUBLIC_URL into client-side
 * @param env - Optional Cloudflare env object (for production)
 */
export function getR2PublicUrl(env?: Record<string, unknown>): string {
  if (env && 'R2_PUBLIC_URL' in env) {
    const value = env.R2_PUBLIC_URL;
    return typeof value === 'string' ? value : String(value);
  }
  
  return process.env.R2_PUBLIC_URL || '';
}
