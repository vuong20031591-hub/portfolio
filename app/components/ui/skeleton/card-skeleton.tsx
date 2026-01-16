import * as React from "react";
import { Skeleton } from "./skeleton";
import styles from "./card-skeleton.module.css";

interface CardSkeletonProps {
  /** Số lượng cards cần hiển thị */
  count?: number;
  /** Custom className */
  className?: string;
  /** Hiển thị image skeleton */
  showImage?: boolean;
  /** Chiều cao của image (nếu có) */
  imageHeight?: string;
}

/**
 * CardSkeleton - Skeleton cho card layout
 * Dùng chung cho project cards, blog cards, etc.
 */
export function CardSkeleton({
  count = 1,
  className,
  showImage = true,
  imageHeight = "240px",
}: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${styles.card} ${className || ""}`}>
          {showImage && (
            <Skeleton className={styles.image} style={{ height: imageHeight }} />
          )}
          <div className={styles.content}>
            <Skeleton className={styles.title} />
            <Skeleton className={styles.description} />
            <Skeleton className={styles.descriptionShort} />
            <div className={styles.footer}>
              <Skeleton className={styles.tag} />
              <Skeleton className={styles.tag} />
              <Skeleton className={styles.tag} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
