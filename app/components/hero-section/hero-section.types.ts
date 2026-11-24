/**
 * Types cho HeroSection component
 */

export interface HeroSectionProps {
  /** ID cho section element, dùng cho IntersectionObserver */
  id?: string;
  className?: string;
}

export interface HeroTranslations {
  greeting: string;
  title: string;
  subtitle: string;
  locationLabel: string;
  locationValue: string;
  rolePrimary: string;
  roleSecondary: string;
}
