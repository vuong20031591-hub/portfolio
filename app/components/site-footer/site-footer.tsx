import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import styles from "./site-footer.module.css";

/**
 * SiteFooter - Footer của trang web
 */
export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <ScrollReveal variant="fade-up" width="100%">
        <div className={styles.footerContent}>
          <div className={styles.footerSignature}>VuongTech</div>
          <p className={styles.footerText}>{t.footer.copyright}</p>
        </div>
      </ScrollReveal>
    </footer>
  );
}
