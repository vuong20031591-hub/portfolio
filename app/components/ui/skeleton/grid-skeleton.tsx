import * as React from "react";
import { CardSkeleton } from "./card-skeleton";
import styles from "./grid-skeleton.module.css";

interface GridSkeletonProps {
  /** Số lượng cards */
  cards?: number;
  /** Số cột trong grid */
  columns?: number;
  /** Custom className */
  className?: string;
  /** Hiển thị image trong cards */
  showImage?: boolean;
  /** Chiều cao image */
  imageHeight?: string;
}

/**
 * GridSkeleton - Wrapper cho grid layout với skeleton cards
 * Dùng chung cho projects grid, blog grid, etc.
 */
export function GridSkeleton({
  cards = 6,
  columns = 3,
  className,
  showImage = true,
  imageHeight = "240px",
}: GridSkeletonProps) {
  return (
    <div
      className={`${styles.grid} ${className || ""}`}
      style={
        {
          "--grid-columns": columns,
        } as React.CSSProperties
      }
    >
      <CardSkeleton
        count={cards}
        showImage={showImage}
        imageHeight={imageHeight}
      />
    </div>
  );
}
