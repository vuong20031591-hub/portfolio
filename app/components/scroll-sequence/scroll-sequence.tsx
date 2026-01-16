import { useRef, useEffect, useState, useCallback } from "react";
import classNames from "classnames";
import styles from "./scroll-sequence.module.css";
import type { ScrollSequenceProps } from "./scroll-sequence.types";
import { useScrollSequence, useOnDemandLoader } from "./use-scroll-sequence";

/**
 * Scroll-Driven Image Sequence Component
 * Apple-style cinematic scroll animation using canvas
 * 
 * Tối ưu: On-demand loading - chỉ load frames cần thiết
 * - Frame đầu tiên hiển thị ngay lập tức
 * - Buffer load xung quanh vị trí scroll
 * - Background load khi idle
 */
export function ScrollSequence({
  frameBasePath,
  totalFrames,
  extension = "webp",
  framePadding = 3,
  scrollHeight = 3,
  className,
  onLoadComplete,
  onLoadProgress,
  children,
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Track scroll position → frame index
  const { currentFrame } = useScrollSequence({
    totalFrames,
    containerRef,
  });

  // ⚡ On-demand loader: load frames theo scroll position
  const { getImage, isFirstFrameReady, loadedCount, progress } = useOnDemandLoader({
    frameBasePath,
    totalFrames,
    extension,
    framePadding,
    currentFrame,
    bufferSize: 20, // Load 20 frames trước/sau vị trí hiện tại
    onFirstFrameReady: () => {
      // Có thể trigger animation hoặc callback ở đây
    },
  });

  // Notify progress
  useEffect(() => {
    onLoadProgress?.(progress);
    if (loadedCount >= totalFrames) {
      onLoadComplete?.();
    }
  }, [progress, loadedCount, totalFrames, onLoadProgress, onLoadComplete]);

  // Tính toán loading state: đợi load ít nhất 10% frames hoặc 20 frames (tùy cái nào nhỏ hơn)
  const minFramesForReady = Math.min(Math.ceil(totalFrames * 0.1), 20);
  const isReadyToDisplay = isFirstFrameReady && loadedCount >= minFramesForReady;

  // Set canvas size to viewport size for fullscreen effect
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Draw current frame to canvas với responsive object-fit logic
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = getImage(currentFrame);

    if (!canvas || !ctx || !img) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Responsive fit mode:
    // - Desktop/Landscape: object-fit: cover (fill toàn bộ)
    // - Mobile/Portrait: object-fit: contain (hiển thị đầy đủ ảnh)
    const isPortrait = canvasHeight > canvasWidth;
    
    let scale: number;
    if (isPortrait) {
      // Mobile portrait: contain - fit theo chiều ngang để hiển thị đủ 2 người
      scale = canvasWidth / imgWidth;
    } else {
      // Desktop landscape: cover - fill toàn bộ canvas
      scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    }
    
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    // Center ảnh theo chiều ngang, điều chỉnh vị trí dọc
    const x = (canvasWidth - scaledWidth) / 2;
    // Portrait: đặt ảnh ở phần dưới màn hình (không center)
    // Desktop: center bình thường
    const y = isPortrait 
      ? canvasHeight - scaledHeight // Đặt ảnh sát đáy
      : (canvasHeight - scaledHeight) / 2;

    // Clear và vẽ frame mới
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  }, [getImage, currentFrame]);

  // Redraw when frame changes or dimensions change
  useEffect(() => {
    if (isFirstFrameReady) {
      drawFrame();
    }
  }, [isFirstFrameReady, drawFrame, dimensions, currentFrame]);

  // Progress hiển thị: tính theo minFramesForReady thay vì totalFrames
  // Để user thấy progress chạy nhanh hơn và có ý nghĩa
  const displayProgress = Math.min(loadedCount / minFramesForReady, 1);
  const progressPercent = Math.round(displayProgress * 100);

  return (
    <div
      ref={containerRef}
      className={classNames(styles.container, className)}
      style={{ height: `${scrollHeight * 100}vh` }}
    >
      <div className={styles.stickyWrapper}>
        {/* Modern Loading Overlay */}
        <div className={classNames(styles.loadingOverlay, { [styles.hidden]: isReadyToDisplay })}>
          <div className={styles.loadingContent}>
            {/* Animated Logo Ring */}
            <div className={styles.logoRing}>
              <div className={styles.logoRingOuter} />
              <div className={styles.logoRingProgress} />
              <div className={styles.logoRingInner}>
                <span className={styles.logoInitial}>P</span>
              </div>
            </div>

            {/* Loading Text */}
            <div className={styles.loadingTextWrapper}>
              <p className={styles.loadingText}>Loading</p>
              <p className={styles.loadingSubtext}>Preparing cinematic experience</p>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressWrapper}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={styles.progressPercent}>{progressPercent}%</span>
            </div>

            {/* Animated Dots */}
            <div className={styles.loadingDots}>
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} />
            </div>
          </div>
        </div>

        {/* Canvas for rendering frames - fullscreen */}
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={dimensions.width}
          height={dimensions.height}
        />

        {/* Children overlay content - renders on top of canvas */}
        {children}
      </div>
    </div>
  );
}
