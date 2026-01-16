import { useState, useEffect, useCallback, useRef } from "react";
import type {
  UseScrollSequenceOptions,
  UseScrollSequenceReturn,
  UseImagePreloaderOptions,
  UseImagePreloaderReturn,
  UseOnDemandLoaderOptions,
  UseOnDemandLoaderReturn,
} from "./scroll-sequence.types";

/**
 * Hook để tính toán frame hiện tại dựa trên scroll position
 */
export function useScrollSequence({
  totalFrames,
  containerRef,
}: UseScrollSequenceOptions): UseScrollSequenceReturn {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Tính scroll progress trong container
    // Khi top của container chạm top viewport → 0
    // Khi bottom của container chạm bottom viewport → 1
    const scrollableDistance = rect.height - windowHeight;
    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    setProgress(rawProgress);

    // Map progress → frame index (0 to totalFrames - 1)
    const frameIndex = Math.min(
      Math.floor(rawProgress * totalFrames),
      totalFrames - 1
    );
    setCurrentFrame(frameIndex);
  }, [totalFrames, containerRef]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(handleScroll);
    };

    // Initial calculation
    handleScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return { currentFrame, progress };
}

/**
 * Tạo URL cho frame dựa trên index
 */
export function getFrameUrl(
  basePath: string,
  frameIndex: number,
  extension: string,
  padding: number
): string {
  const paddedNumber = String(frameIndex + 1).padStart(padding, "0");
  return `${basePath}${paddedNumber}.${extension}`;
}

/**
 * Hook để preload tất cả images
 */
export function useImagePreloader({
  frameBasePath,
  totalFrames,
  extension,
  framePadding,
  onProgress,
  onComplete,
}: UseImagePreloaderOptions): UseImagePreloaderReturn {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const imageArray: HTMLImageElement[] = [];
    let loaded = 0;

    const loadImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          onProgress?.(loaded / totalFrames);
          resolve(img);
        };
        img.onerror = reject;
        img.src = getFrameUrl(frameBasePath, index, extension, framePadding);
      });
    };

    // Load images in batches để tránh quá tải network
    const loadAllImages = async () => {
      const batchSize = 20;
      
      for (let i = 0; i < totalFrames; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, totalFrames); j++) {
          batch.push(loadImage(j));
        }
        const loadedBatch = await Promise.all(batch);
        imageArray.push(...loadedBatch);
      }

      setImages(imageArray);
      setIsLoading(false);
      onComplete?.();
    };

    loadAllImages();
  }, [frameBasePath, totalFrames, extension, framePadding, onProgress, onComplete]);

  return {
    images,
    isLoading,
    loadedCount,
    progress: loadedCount / totalFrames,
  };
}


/**
 * ⚡ On-Demand Image Loader
 * Tối ưu cho mobile: Load frames theo scroll position thay vì tất cả cùng lúc
 * 
 * Chiến lược:
 * 1. Load frame đầu tiên NGAY LẬP TỨC (priority)
 * 2. Load buffer xung quanh vị trí scroll hiện tại
 * 3. Background load các frames còn lại khi idle
 */
export function useOnDemandLoader({
  frameBasePath,
  totalFrames,
  extension,
  framePadding,
  currentFrame,
  bufferSize = 15,
  onFirstFrameReady,
}: UseOnDemandLoaderOptions): UseOnDemandLoaderReturn {
  // Cache images đã load (Map để O(1) lookup)
  const imageCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingSet = useRef<Set<number>>(new Set());
  
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Tạo URL cho frame
  // Note: frameBasePath có thể là local path hoặc CDN URL
  // CDN config sẽ handle việc chuyển đổi tự động
  const getFrameUrl = useCallback(
    (index: number): string => {
      const paddedNumber = String(index + 1).padStart(framePadding, "0");
      return `${frameBasePath}${paddedNumber}.${extension}`;
    },
    [frameBasePath, framePadding, extension]
  );

  // Load single image với Promise
  const loadImage = useCallback(
    (index: number): Promise<HTMLImageElement | null> => {
      // Đã có trong cache
      if (imageCache.current.has(index)) {
        return Promise.resolve(imageCache.current.get(index)!);
      }

      // Đang load
      if (loadingSet.current.has(index)) {
        return Promise.resolve(null);
      }

      // Bắt đầu load
      loadingSet.current.add(index);

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageCache.current.set(index, img);
          loadingSet.current.delete(index);
          setLoadedCount(imageCache.current.size);
          resolve(img);
        };
        img.onerror = () => {
          loadingSet.current.delete(index);
          resolve(null);
        };
        img.src = getFrameUrl(index);
      });
    },
    [getFrameUrl]
  );

  // Load frame đầu tiên NGAY LẬP TỨC (highest priority)
  useEffect(() => {
    if (isFirstFrameReady) return;

    loadImage(0).then((img) => {
      if (img) {
        setIsFirstFrameReady(true);
        onFirstFrameReady?.();
      }
    });
  }, [loadImage, isFirstFrameReady, onFirstFrameReady]);

  // Load buffer xung quanh vị trí scroll hiện tại
  useEffect(() => {
    if (!isFirstFrameReady) return;

    const loadBuffer = async () => {
      // Tính range cần load: [currentFrame - buffer, currentFrame + buffer]
      const start = Math.max(0, currentFrame - bufferSize);
      const end = Math.min(totalFrames - 1, currentFrame + bufferSize);

      // Ưu tiên load frames gần currentFrame trước
      const framesToLoad: number[] = [];
      
      // Load từ currentFrame ra ngoài (gần → xa)
      for (let offset = 0; offset <= bufferSize; offset++) {
        const forward = currentFrame + offset;
        const backward = currentFrame - offset;
        
        if (forward <= end && !imageCache.current.has(forward)) {
          framesToLoad.push(forward);
        }
        if (backward >= start && backward !== forward && !imageCache.current.has(backward)) {
          framesToLoad.push(backward);
        }
      }

      // Load theo batch nhỏ để không block main thread
      const batchSize = 5;
      for (let i = 0; i < framesToLoad.length; i += batchSize) {
        const batch = framesToLoad.slice(i, i + batchSize);
        await Promise.all(batch.map(loadImage));
      }
    };

    loadBuffer();
  }, [currentFrame, bufferSize, totalFrames, isFirstFrameReady, loadImage]);

  // Background load các frames còn lại khi idle
  useEffect(() => {
    if (!isFirstFrameReady) return;
    if (imageCache.current.size >= totalFrames) return;

    // Polyfill cho Safari (không hỗ trợ requestIdleCallback)
    const requestIdle = 
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback
        : (cb: IdleRequestCallback, _options?: IdleRequestOptions) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline), 50);
    
    const cancelIdle =
      typeof window !== "undefined" && "cancelIdleCallback" in window
        ? window.cancelIdleCallback
        : clearTimeout;

    let idleId: number;

    const loadRemaining = () => {
      // Tìm frames chưa load
      for (let i = 0; i < totalFrames; i++) {
        if (!imageCache.current.has(i) && !loadingSet.current.has(i)) {
          loadImage(i);
          break; // Load 1 frame mỗi idle callback
        }
      }

      // Tiếp tục nếu còn frames chưa load
      if (imageCache.current.size < totalFrames) {
        idleId = requestIdle(loadRemaining, { timeout: 1000 }) as number;
      }
    };

    // Bắt đầu background loading
    idleId = requestIdle(loadRemaining, { timeout: 2000 }) as number;
    
    return () => cancelIdle(idleId);
  }, [isFirstFrameReady, totalFrames, loadImage]);

  // Getter để lấy image từ cache
  const getImage = useCallback(
    (index: number): HTMLImageElement | null => {
      return imageCache.current.get(index) ?? null;
    },
    []
  );

  return {
    getImage,
    isFirstFrameReady,
    loadedCount,
    progress: loadedCount / totalFrames,
  };
}
