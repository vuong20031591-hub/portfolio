import type { ReactNode } from "react";

/**
 * Props cho ProjectsSection component
 */
export interface ProjectsSectionProps {
  /** Custom className */
  className?: string;
  /** Callback khi chọn project để xem chi tiết */
  onSelectProject?: (index: number, view?: 'info' | 'demo') => void;
  /** Index của project đang được chọn */
  selectedProject?: number | null;
  /** Danh sách projects từ GitHub (optional - nếu không có sẽ dùng mock data) */
  projects?: ProjectItem[];
}

/**
 * Thông tin một project
 */
export interface ProjectItem {
  /** ID unique */
  id?: string;
  /** Tiêu đề project */
  title: string;
  /** Mô tả ngắn */
  description: string;
  /** URL hình ảnh */
  image: string;
  /** Danh sách tags/technologies */
  tags: string[];
  /** GitHub URL */
  githubUrl?: string;
  /** Live demo URL */
  liveUrl?: string | null;
  /** Số stars */
  stars?: number;
  /** Số forks */
  forks?: number;
  /** Ngôn ngữ chính */
  language?: string | null;
  /** README content */
  readme?: string | null;
  /** Danh sách features */
  features?: string[];
  /** Tech stack */
  techStack?: string[];
}
