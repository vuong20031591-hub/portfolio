/**
 * Props cho ProjectModal component
 */
export interface ProjectModalProps {
  /** Index của project đang được chọn (null = đóng modal) */
  selectedProject: number | null;
  /** Callback khi đóng modal */
  onClose: () => void;
  /** Danh sách projects */
  projects: ProjectData[];
  /** View mặc định khi mở modal: 'info' hoặc 'demo' */
  initialView?: 'info' | 'demo';
}

/**
 * Dữ liệu một project
 */
export interface ProjectData {
  /** ID unique */
  id?: string;
  /** Tiêu đề */
  title: string;
  /** Mô tả */
  description: string;
  /** URL hình ảnh */
  image: string;
  /** Tags/Technologies */
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
