import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import styles from "./experience-section.module.css";
import type { ExperienceItem } from "./experience-section.types";

/**
 * ExperienceSection — Editorial Chronological Rows
 */
export function ExperienceSection() {
  const { t } = useLanguage();

  const experience: ExperienceItem[] = [
    {
      role: t.homeExperience.job1.role,
      company: t.homeExperience.job1.company,
      period: t.homeExperience.job1.period,
      description: t.homeExperience.job1.description,
    },
    {
      role: t.homeExperience.job2.role,
      company: t.homeExperience.job2.company,
      period: t.homeExperience.job2.period,
      description: t.homeExperience.job2.description,
    },
    {
      role: t.homeExperience.job3.role,
      company: t.homeExperience.job3.company,
      period: t.homeExperience.job3.period,
      description: t.homeExperience.job3.description,
    },
  ];

  return (
    <section className={styles.section} id="experience">
      <div className={styles.inner}>
        <ScrollReveal variant="fade-up" width="100%">
          <header className={styles.sectionHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.eyebrow}>03</span>
              <h2 className={styles.sectionTitle}>{t.experience.title}</h2>
            </div>
          </header>
        </ScrollReveal>

        <div className={styles.list}>
          {experience.map((job, index) => (
            <ScrollReveal
              key={job.role}
              variant="fade-up"
              delay={index * 0.08}
              width="100%"
            >
              <article className={styles.row}>
                <div className={styles.periodCol}>
                  <span
                    className={`${styles.period} ${index === 0 ? styles.periodActive : ""}`}
                  >
                    {job.period}
                  </span>
                </div>

                <div className={styles.roleCol}>
                  <h3 className={styles.jobRole}>{job.role}</h3>
                  <p className={styles.jobCompany}>{job.company}</p>
                </div>

                <div className={styles.descCol}>
                  <p className={styles.jobDescription}>{job.description}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
