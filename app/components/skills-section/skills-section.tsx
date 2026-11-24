import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import styles from "./skills-section.module.css";

interface EditorialSkill {
  title: string;
  description: string;
  stack: string[];
}

/**
 * SkillsSection — Editorial Columns (inspired by Dennis Snellenberg "I can help you with...")
 * Không khung card nặng nề, không badge rối mắt: chỉ số thứ tự, đường kẻ hairline,
 * typography sắc nét và dòng tech stack tinh giản.
 */
export function SkillsSection() {
  const { t } = useLanguage();

  const skills: EditorialSkill[] = [
    {
      title: t.skills.frontend.title,
      description: t.skills.frontend.description,
      stack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs"],
    },
    {
      title: t.skills.backend.title,
      description: t.skills.backend.description,
      stack: ["Node.js", "Python", "Java / Spring", "APIs"],
    },
    {
      title: t.skills.design.title,
      description: t.skills.design.description,
      stack: ["Figma", "Design Systems", "Responsive UI", "Motion"],
    },
    {
      title: t.skills.architecture.title,
      description: t.skills.architecture.description,
      stack: ["Git / GitHub", "Vite", "Vercel", "GitHub Actions"],
    },
  ];

  return (
    <section className={styles.section} id="skills">
      <div className={styles.inner}>
        <ScrollReveal variant="fade-up" width="100%">
          <header className={styles.sectionHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.eyebrow}>01</span>
              <h2 className={styles.sectionTitle}>{t.skills.title}</h2>
            </div>
            <p className={styles.sectionSubtitle}>{t.skills.subtitle}</p>
          </header>
        </ScrollReveal>

        <div className={styles.columns}>
          {skills.map((skill, index) => (
            <ScrollReveal
              key={skill.title}
              variant="fade-up"
              delay={index * 0.08}
              width="100%"
              className={styles.colReveal}
            >
              <article className={styles.column}>
                <div className={styles.colIndexRow}>
                  <span className={styles.colIndex}>0{index + 1}</span>
                </div>

                <h3 className={styles.colTitle}>{skill.title}</h3>
                <p className={styles.colDescription}>{skill.description}</p>

                <p className={styles.colStack}>
                  {skill.stack.join(" · ")}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
