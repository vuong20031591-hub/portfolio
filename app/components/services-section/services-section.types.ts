export interface ServiceItem {
  title: string;
  price: string;
  timeline: string;
  features: string[];
}

export interface ServicesSectionProps {
  /** Callback mở form liên hệ */
  onContactOpenChange: (open: boolean) => void;
}
