import {
  Layout,
  Server,
  Palette,
  Layers,
  Workflow,
  PenTool,
  Users,
  Network,
  FolderGit,
  Database,
  Zap,
  Globe,
} from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiCss3,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiRedis,
  SiFigma,
} from "react-icons/si";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import styles from "./skills-section.module.css";
import type { SkillItem } from "./skills-section.types";

/**
 * SkillsSection - Hiển thị kỹ năng dạng Bento Grid
 */
export function SkillsSection() {
  const { t } = useLanguage();

  const skills: SkillItem[] = [
    {
      icon: <Layout className="w-8 h-8" />,
      title: t.skills.frontend.title,
      description: t.skills.frontend.description,
      tags: [
        { name: "React", icon: <SiReact /> },
        { name: "TypeScript", icon: <SiTypescript /> },
        { name: "Next.js", icon: <SiNextdotjs /> },
        { name: "CSS Modules", icon: <SiCss3 /> },
        { name: "REST APIs", icon: <Globe size={14} /> },
      ],
      className: styles.bentoLarge,
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: t.skills.backend.title,
      description: t.skills.backend.description,
      tags: [
        { name: "Node.js", icon: <SiNodedotjs /> },
        { name: "PostgreSQL", icon: <SiPostgresql /> },
        { name: "Docker", icon: <SiDocker /> },
        { name: "Redis", icon: <SiRedis /> },
        { name: "CI/CD", icon: <Workflow size={14} /> },
      ],
      className: styles.bentoTall,
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: t.skills.design.title,
      description: t.skills.design.description,
      tags: [
        { name: "Figma", icon: <SiFigma /> },
        { name: "Design Systems", icon: <PenTool size={14} /> },
        { name: "Prototyping", icon: <Layers size={14} /> },
        { name: "User Research", icon: <Users size={14} /> },
      ],
      className: styles.bentoNormal,
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: t.skills.architecture.title,
      description: t.skills.architecture.description,
      tags: [
        { name: "Microservices", icon: <Network size={14} /> },
        { name: "Monorepos", icon: <FolderGit size={14} /> },
        { name: "State Mgmt", icon: <Database size={14} /> },
        { name: "Performance", icon: <Zap size={14} /> },
      ],
      className: styles.bentoNormal,
    },
  ];

  return (
    <section className={styles.section} id="skills">
      <ScrollReveal variant="fade-up" width="100%">
        <h2 className={styles.sectionTitle}>{t.skills.title}</h2>
        <p className={styles.sectionSubtitle}>{t.skills.subtitle}</p>
      </ScrollReveal>

      <div className={styles.bentoGrid}>
        {skills.map((skill, index) => (
          <ScrollReveal
            key={index}
            variant="fade-up"
            delay={index * 0.1}
            width="100%"
            className={skill.className}
          >
            <div className={styles.bentoCard}>
              <div className={styles.bentoIconWrapper}>{skill.icon}</div>
              <div className={styles.bentoContent}>
                <h3 className={styles.bentoTitle}>{skill.title}</h3>
                <p className={styles.bentoDescription}>{skill.description}</p>
                <div className={styles.bentoTags}>
                  {skill.tags.map((tag) => (
                    <span key={tag.name} className={styles.bentoTag}>
                      {tag.icon}
                      <span>{tag.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
