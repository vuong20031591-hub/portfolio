"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation, type UseInViewOptions } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%" | string;
  className?: string;
  variant?: "fade-up" | "fade-left" | "fade-right" | "scale" | "none";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

/**
 * Hook to detect if user prefers reduced motion
 */
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export const ScrollReveal = ({
  children,
  width = "fit-content",
  className = "",
  variant = "fade-up",
  delay = 0,
  duration = 0.5,
  threshold = 0.2,
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const controls = useAnimation();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  // Respect user's motion preferences
  const variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        "fade-up": {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        },
        "fade-left": {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        },
        "fade-right": {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        },
        scale: {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        },
        none: {
          hidden: {},
          visible: {},
        },
      }[variant];

  return (
    <div ref={ref} style={{ width, position: "relative" }} className={className}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={controls}
        transition={{ 
          duration: prefersReducedMotion ? 0.1 : duration, 
          delay: prefersReducedMotion ? 0 : delay, 
          ease: "easeOut" 
        }}
        style={{ height: "100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
