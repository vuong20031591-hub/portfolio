import type { ReactNode } from "react";

/**
 * Props cho ExperienceSection component
 */
export interface ExperienceSectionProps {
  /** Custom className */
  className?: string;
}

/**
 * Thông tin một công việc/kinh nghiệm
 */
export interface ExperienceItem {
  /** Vị trí công việc */
  role: string;
  /** Tên công ty */
  company: string;
  /** Thời gian làm việc */
  period: string;
  /** Mô tả công việc */
  description: string;
}
