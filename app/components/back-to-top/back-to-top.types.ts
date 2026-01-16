/**
 * Back to Top Button - Type Definitions
 */

export interface BackToTopProps {
  /** 
   * ID của hero section để detect visibility
   * @default "hero" 
   */
  heroId?: string;
  
  /** 
   * Fallback scroll threshold (px) khi IntersectionObserver không khả dụng
   * @default 400 
   */
  scrollThreshold?: number;
  
  /** 
   * Custom className cho button
   */
  className?: string;
  
  /**
   * Aria label cho accessibility
   * @default "Back to top"
   */
  ariaLabel?: string;
}
