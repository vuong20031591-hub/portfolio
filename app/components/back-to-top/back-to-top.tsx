import classNames from "classnames";
import { useBackToTop, useScrollToTop } from "./back-to-top.hooks";
import type { BackToTopProps } from "./back-to-top.types";
import styles from "./back-to-top.module.css";

/**
 * Back to Top Button Component
 * 
 * Floating button xuất hiện khi user scroll qua hero section.
 * Sử dụng IntersectionObserver với fallback scrollY threshold.
 * 
 * @example
 * // Basic usage (hero section có id="hero")
 * <BackToTop />
 * 
 * @example
 * // Custom hero ID và threshold
 * <BackToTop heroId="main-hero" scrollThreshold={500} />
 */
export function BackToTop({
  heroId = "hero",
  scrollThreshold = 400,
  className,
  ariaLabel = "Back to top",
}: BackToTopProps) {
  const isVisible = useBackToTop({ heroId, scrollThreshold });
  const scrollToTop = useScrollToTop(heroId);

  return (
    <button
      type="button"
      className={classNames(
        styles.backToTop,
        isVisible && styles.visible,
        className
      )}
      onClick={scrollToTop}
      aria-label={ariaLabel}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      {/* Up Arrow SVG Icon */}
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
