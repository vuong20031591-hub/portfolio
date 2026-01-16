/**
 * Props cho TestimonialsSection component
 */
export interface TestimonialsSectionProps {
  /** Custom className */
  className?: string;
}

/**
 * Thông tin một testimonial
 */
export interface TestimonialItem {
  /** Nội dung quote */
  quote: string;
  /** Tên tác giả */
  author: string;
  /** Chức danh */
  title: string;
  /** URL avatar */
  avatar: string;
}
