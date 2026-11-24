import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import styles from "./curved-divider.module.css";

export interface CurvedDividerProps {
  /** Màu nền của section phía trên (màu phần bụng cong) */
  topColor?: string;
  /** Màu nền của section phía dưới (lộ ra ở 2 bên góc cong) */
  bottomColor?: string;
  /** Chiều cao tối đa (px) của độ cong khi bắt đầu vào viewport */
  maxHeight?: number;
  /** Hiển thị bóng đổ mềm phía dưới mép cong như Dennis Snellenberg */
  shadow?: boolean;
  className?: string;
}

/**
 * CurvedDivider — Viền cong chuyển section động theo scroll (Dennis Snellenberg style)
 * Khi người dùng cuộn qua ranh giới giữa 2 section, độ cong sẽ phẳng dần từ maxHeight -> 0px.
 */
export function CurvedDivider({
  topColor = "var(--color-neutral-1)",
  bottomColor = "#1c1d20",
  maxHeight = 100,
  shadow = true,
  className,
}: CurvedDividerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"],
  });

  // Giữ độ cong sâu rõ khi đi qua giữa viewport rồi mới phẳng dần về 0 ở cuối
  const animatedHeight = useTransform(scrollYProgress, [0, 0.95], [maxHeight, 0]);

  return (
    <div
      ref={triggerRef}
      className={`${styles.divider} ${className ?? ""}`}
      style={{ backgroundColor: bottomColor }}
      aria-hidden="true"
    >
      <motion.div
        className={styles.curveContainer}
        style={{ height: prefersReducedMotion ? Math.round(maxHeight * 0.35) : animatedHeight }}
      >
        <div
          className={`${styles.curveArc} ${shadow ? styles.withShadow : ""}`}
          style={{ backgroundColor: topColor }}
        />
      </motion.div>
    </div>
  );
}
