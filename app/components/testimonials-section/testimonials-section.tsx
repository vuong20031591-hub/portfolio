import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import styles from "./testimonials-section.module.css";
import type { TestimonialItem } from "./testimonials-section.types";

/**
 * TestimonialsSection — Editorial 3x2 Values & Philosophy Grid
 */
export function TestimonialsSection() {
  const { t } = useLanguage();

  const values: TestimonialItem[] = t.testimonials.items.map((item) => ({
    ...item,
    avatar: "",
  }));

  return (
    <section className={styles.section} id="values">
      <div className={styles.inner}>
        <ScrollReveal variant="fade-up" width="100%">
          <header className={styles.sectionHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.eyebrow}>04</span>
              <h2 className={styles.sectionTitle}>{t.testimonials.title}</h2>
            </div>
            <p className={styles.sectionSubtitle}>{t.testimonials.subtitle}</p>
          </header>
        </ScrollReveal>

        <div className={styles.grid}>
          {values.map((item, index) => (
            <ScrollReveal
              key={item.author}
              variant="fade-up"
              delay={index * 0.06}
              width="100%"
              className={styles.cardReveal}
            >
              <article className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardIndex}>0{index + 1}</span>
                  <span className={styles.cardLabel}>{item.title}</span>
                </div>
                <p className={styles.quote}>&ldquo;{item.quote}&rdquo;</p>
                <h3 className={styles.author}>{item.author}</h3>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
