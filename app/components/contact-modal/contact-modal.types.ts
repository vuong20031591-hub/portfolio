/**
 * Props cho ContactModal component
 */
export interface ContactModalProps {
  /** Trạng thái mở/đóng modal */
  isOpen: boolean;
  /** Callback khi đóng modal */
  onClose: () => void;
}
