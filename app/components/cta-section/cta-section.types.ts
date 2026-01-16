/**
 * Props cho CTASection component
 */
export interface CTASectionProps {
  /** Custom className */
  className?: string;
  /** Trạng thái mở form liên hệ */
  isContactOpen: boolean;
  /** Callback khi thay đổi trạng thái form */
  onContactOpenChange: (open: boolean) => void;
}
