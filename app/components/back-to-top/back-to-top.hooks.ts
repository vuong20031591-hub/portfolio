import { useState, useEffect, useCallback, useRef } from "react";

interface UseBackToTopOptions {
  heroId: string;
  scrollThreshold: number;
}

/**
 * Custom hook để quản lý visibility của Back to Top button
 * Sử dụng IntersectionObserver với fallback scrollY threshold
 */
export function useBackToTop({ heroId, scrollThreshold }: UseBackToTopOptions) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const heroElement = document.getElementById(heroId);
    
    // Kiểm tra IntersectionObserver support
    const supportsIntersectionObserver = "IntersectionObserver" in window;

    if (heroElement && supportsIntersectionObserver) {
      // Option A: Sử dụng IntersectionObserver (preferred)
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          // Hiện button khi hero KHÔNG còn visible
          setIsVisible(!entry.isIntersecting);
        },
        {
          root: null, // viewport
          rootMargin: "0px",
          threshold: 0, // trigger ngay khi hero bắt đầu ra khỏi viewport
        }
      );

      observerRef.current.observe(heroElement);

      return () => {
        observerRef.current?.disconnect();
      };
    } else {
      // Option B: Fallback với scroll listener
      const handleScroll = () => {
        setIsVisible(window.scrollY > scrollThreshold);
      };

      // Throttle scroll handler để tránh layout thrashing
      let ticking = false;
      const throttledScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", throttledScroll, { passive: true });
      
      // Check initial state
      handleScroll();

      return () => {
        window.removeEventListener("scroll", throttledScroll);
      };
    }
  }, [heroId, scrollThreshold]);

  return isVisible;
}

/**
 * Hook để scroll to top với respect prefers-reduced-motion
 * @param heroId - ID của hero section (không sử dụng, giữ để backward compatible)
 */
export function useScrollToTop(heroId: string = "hero") {
  const scrollToTop = useCallback(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Sử dụng instant scroll để tránh conflict với scroll listeners khác
    // Smooth scroll có thể bị interrupt bởi useScrollSequence hoặc các scroll handlers khác
    if (prefersReducedMotion) {
      // Instant scroll cho reduced motion
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // Sử dụng requestAnimationFrame để đảm bảo scroll hoàn tất
      // trước khi các scroll listeners khác can thiệp
      const scrollToTopInstant = () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      };
      
      // Thực hiện scroll ngay lập tức
      scrollToTopInstant();
    }
  }, []);

  return scrollToTop;
}
