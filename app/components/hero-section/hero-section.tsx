import classNames from "classnames";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { ScrollSequence } from "~/components/scroll-sequence";
import { useLanguage } from "~/contexts/language";
import { CDN_CONFIG } from "~/config/cdn";
import styles from "./hero-section.module.css";
import type { HeroSectionProps } from "./hero-section.types";

/**
 * HeroSection với Scroll-Driven Image Sequence
 * Apple-style cinematic scroll animation
 */
export function HeroSection({ id = "hero", className }: HeroSectionProps) {
  const { t } = useLanguage();

  // Get frame base path from CDN config
  // Will use R2 CDN if configured, otherwise fallback to local public folder
  const frameBasePath = CDN_CONFIG.USE_R2_CDN
    ? `${CDN_CONFIG.R2_PUBLIC_URL}${CDN_CONFIG.SPOTLIGHT_BASE_PATH}/spotlight-frame-`
    : "/images/news/spotlight-frame-";

  return (
    <section id={id} className={classNames(styles.heroSequence, className)}>
      {/* Scroll-Driven Image Sequence với overlay content bên trong */}
      <ScrollSequence
        frameBasePath={frameBasePath}
        totalFrames={272}
        extension="webp"
        framePadding={3}
        scrollHeight={5}
        className={styles.heroCanvas}
      >
        {/* Text overlay - nằm trong sticky wrapper của ScrollSequence */}
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <ScrollReveal variant="fade-up" delay={0.2}>
                <p className={styles.greeting}>{t.hero.greeting}</p>
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={0.4}>
                <h1 className={styles.title}>{t.hero.title}</h1>
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={0.6}>
                <p className={styles.subtitle}>{t.hero.subtitle}</p>
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={0.8}>
                <div className={styles.signature}>Nguyễn Tiến Vương</div>
              </ScrollReveal>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollLine} />
          </div>
        </div>
      </ScrollSequence>
    </section>
  );
}
