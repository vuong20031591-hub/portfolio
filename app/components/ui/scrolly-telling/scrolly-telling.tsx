import type { ReactNode } from "react";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import styles from "./scrolly-telling.module.css";
import { cn } from "~/lib/utils";

interface ScrollyTellingProps {
  items: {
    title: string;
    text: string;
    visual: ReactNode;
  }[];
  className?: string;
}

/**
 * Editorial 4-Step Process Grid
 * Hiển thị trực tiếp 4 bước quy trình làm việc dạng lưới tối giản,
 * liền mạch với HeroSection kiểu Dennis Snellenberg.
 */
export function ScrollyTelling({ items, className }: ScrollyTellingProps) {
  return (
    <section className={cn(styles.section, className)} id="process">
      <div className={styles.inner}>
        <div className={styles.grid}>
          {items.map((item, index) => (
            <ScrollReveal
              key={item.title}
              variant="fade-up"
              delay={index * 0.08}
              width="100%"
              className={styles.itemReveal}
            >
              <article className={styles.item}>
                <div className={styles.itemTop}>
                  <span className={styles.stepNumber}>0{index + 1}</span>
                  <div className={styles.thumb}>{item.visual}</div>
                </div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.text}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
