import { Mail, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button/button";
import { useLanguage } from "~/contexts/language";
import styles from "./cta-section.module.css";
import type { CTASectionProps } from "./cta-section.types";

/**
 * CTASection - Call to Action section với animation expand
 */
export function CTASection({ className, isContactOpen, onContactOpenChange }: CTASectionProps) {
  const { t } = useLanguage();

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className={styles.ctaSection}>
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {/* Bản sao ẩn giữ chiều cao cho card định vị absolute bên dưới */}
        <div className={styles.ctaCardContainer} style={{ opacity: 0, visibility: "hidden" }} aria-hidden="true" inert>
          <div className={styles.ctaContent} style={{ padding: "var(--space-9)" }}>
            <div className={styles.ctaIconWrapper}>
              <Mail className={styles.ctaIcon} />
            </div>
            <h2 className={styles.ctaTitle}>
              {t.cta.title}
              <span>{t.cta.titleHighlight}</span>
            </h2>
            <p className={styles.ctaText}>{t.cta.text}</p>
            <div className={styles.ctaActions}>
              <Button>{t.cta.getInTouch}</Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {!isContactOpen && (
            <motion.div
              layoutId="contact-card"
              className={styles.ctaCardContainer}
              onClick={() => onContactOpenChange(true)}
              style={{ position: "absolute", inset: 0, cursor: "pointer" }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.ctaBackground}>
                <div className={styles.ctaGradient} />
              </div>

              <div className={styles.ctaContent}>
                <div className={styles.ctaIconWrapper}>
                  <Mail className={styles.ctaIcon} />
                </div>

                <h2 className={styles.ctaTitle}>
                  {t.cta.title}
                  <span>{t.cta.titleHighlight}</span>
                </h2>

                <p className={styles.ctaText}>{t.cta.text}</p>

                <div className={styles.ctaActions}>
                  <Button
                    size="lg"
                    className={styles.ctaButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onContactOpenChange(true);
                    }}
                  >
                    {t.cta.getInTouch} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={styles.ctaButtonOutline}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToServices();
                    }}
                  >
                    {t.cta.viewServices}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
