import { ArrowUpRight } from "lucide-react";
import { Button } from "~/components/ui/button/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import styles from "./services-section.module.css";
import type { ServiceItem, ServicesSectionProps } from "./services-section.types";

export function ServicesSection({ onContactOpenChange }: ServicesSectionProps) {
  const { t } = useLanguage();

  const services: ServiceItem[] = [
    t.services.landing,
    t.services.bugfix,
    t.services.automation,
    t.services.design,
  ];

  return (
    <section className={styles.section} id="services">
      <div className={styles.inner}>
        <ScrollReveal variant="fade-up" width="100%">
          <header className={styles.sectionHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.eyebrow}>02</span>
              <h2 className={styles.sectionTitle}>{t.services.title}</h2>
            </div>
            <p className={styles.sectionSubtitle}>{t.services.subtitle}</p>
          </header>
        </ScrollReveal>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <ScrollReveal
              key={service.title}
              variant="fade-up"
              delay={index * 0.08}
              width="100%"
              className={styles.cardReveal}
            >
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <span className={styles.cardIndex}>0{index + 1}</span>
                  </div>
                  <p className={styles.cardPrice}>{service.price}</p>
                  <p className={styles.cardTimeline}>{service.timeline}</p>
                </div>

                <ul className={styles.features}>
                  {service.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  className={styles.cardButton}
                  onClick={() => onContactOpenChange(true)}
                >
                  <span>{t.services.cta}</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <p className={styles.note}>{t.services.note}</p>
      </div>
    </section>
  );
}
