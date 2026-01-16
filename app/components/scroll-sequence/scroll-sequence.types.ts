/**
 * Types cho Scroll-Driven Image Sequence component
 * Apple-style cinematic scroll animation
 */

export interface ScrollSequenceProps {
  /** Đường dẫn base của các frame (không bao gồm số và extension) */
  frameBasePath: string;
  /** Tổng số frame */
  totalFrames: number;
  /** Extension của file ảnh */
  extension?: string;
  /** Padding số (ví dụ: 3 → 001, 002, ...) */
  framePadding?: number;
  /** Chiều cao scroll area (số viewport heights) */
  scrollHeight?: number;
  /** Class name tùy chỉnh */
  className?: string;
  /** Callback khi load xong tất cả frames */
  onLoadComplete?: () => void;
  /** Callback khi đang load (progress 0-1) */
  onLoadProgress?: (progress: number) => void;
  /** Children để render overlay content bên trong sticky wrapper */
  children?: React.ReactNode;
}

export interface UseScrollSequenceOptions {
  totalFrames: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface UseScrollSequenceReturn {
  currentFrame: number;
  progress: number;
}

export interface UseImagePreloaderOptions {
  frameBasePath: string;
  totalFrames: number;
  extension: string;
  framePadding: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export interface UseImagePreloaderReturn {
  images: HTMLImageElement[];
  isLoading: boolean;
  loadedCount: number;
  progress: number;
}

/**
 * On-Demand Image Loader - Load frames theo scroll position
 * Tối ưu cho mobile: chỉ load frames cần thiết
 */
export interface UseOnDemandLoaderOptions {
  frameBasePath: string;
  totalFrames: number;
  extension: string;
  framePadding: number;
  /** Frame hiện tại đang hiển thị */
  currentFrame: number;
  /** Số frames buffer trước/sau vị trí hiện tại */
  bufferSize?: number;
  /** Callback khi frame đầu tiên sẵn sàng */
  onFirstFrameReady?: () => void;
}

export interface UseOnDemandLoaderReturn {
  /** Lấy image tại index (có thể null nếu chưa load) */
  getImage: (index: number) => HTMLImageElement | null;
  /** Frame đầu tiên đã sẵn sàng chưa */
  isFirstFrameReady: boolean;
  /** Số frames đã load */
  loadedCount: number;
  /** Progress tổng thể (0-1) */
  progress: number;
}
