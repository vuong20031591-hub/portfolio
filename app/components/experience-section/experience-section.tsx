import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import styles from "./experience-section.module.css";
import type { ExperienceItem } from "./experience-section.types";

/**
 * ExperienceSection - Hiển thị timeline kinh nghiệm làm việc
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
      <div className={styles.experienceContainer}>
        <ScrollReveal variant="fade-up" width="100%">
          <h2 className={styles.sectionTitle}>{t.experience.title}</h2>
        </ScrollReveal>
        <div className={styles.timeline}>
          {experience.map((job, index) => (
            <ScrollReveal
              key={index}
              variant={index % 2 === 0 ? "fade-right" : "fade-left"}
              delay={index * 0.1}
              width="50%"
              className={styles.timelineEntry}
            >
              <div className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <h3 className={styles.jobRole}>{job.role}</h3>
                    <span className={styles.jobPeriod}>{job.period}</span>
                  </div>
                  <div className={styles.jobCompany}>{job.company}</div>
                  <p className={styles.jobDescription}>{job.description}</p>
                </div>
                <div className={styles.timelineDot} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
