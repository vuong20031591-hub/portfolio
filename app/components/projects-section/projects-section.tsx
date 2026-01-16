import { ExternalLink, ArrowRight, Github, Star, GitFork } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { ParallaxImage } from "~/components/ui/parallax-image";
import { useLanguage } from "~/contexts/language";
import { GridSkeleton } from "~/components/ui/skeleton";
import styles from "./projects-section.module.css";
import type { ProjectsSectionProps, ProjectItem } from "./projects-section.types";

/**
 * ProjectsSection - Hiển thị showcase grid các dự án từ GitHub
 */
export function ProjectsSection({
  className,
  onSelectProject,
  selectedProject,
  projects = [],
}: ProjectsSectionProps) {
  const { t } = useLanguage();

  const handleSelectProject = (index: number, view: 'info' | 'demo' = 'info') => {
    onSelectProject?.(index, view);
  };

  // Hiển thị skeleton khi đang load
  if (projects.length === 0) {
    return (
      <section className={styles.section} id="projects">
        <ScrollReveal variant="fade-up" width="100%">
          <h2 className={styles.sectionTitle}>{t.projects.title}</h2>
          <p className={styles.sectionSubtitle}>{t.projects.subtitle}</p>
        </ScrollReveal>
        <GridSkeleton cards={6} columns={3} />
      </section>
    );
  }

  return (
    <section className={styles.section} id="projects">
      <ScrollReveal variant="fade-up" width="100%">
        <h2 className={styles.sectionTitle}>{t.projects.title}</h2>
        <p className={styles.sectionSubtitle}>{t.projects.subtitle}</p>
      </ScrollReveal>

      <div className={styles.showcaseGrid}>
        {projects.map((project, index) => (
          <ScrollReveal
            key={index}
            variant="fade-up"
            delay={index * 0.1}
            width="100%"
            className={`${styles.showcaseItem} ${index === 0 ? styles.showcaseFeatured : ""}`}
          >
            <ProjectCard
              project={project}
              index={index}
              isSelected={selectedProject === index}
              onSelect={(view) => handleSelectProject(index, view)}
              viewCaseText={t.projects.viewCase}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/** Props cho ProjectCard */
interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  isSelected: boolean;
  onSelect: (view?: 'info' | 'demo') => void;
  viewCaseText: string;
}

/** Component hiển thị một project card */
function ProjectCard({ project, index, isSelected, onSelect, viewCaseText }: ProjectCardProps) {
  if (isSelected) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div
          className={styles.projectCard}
          style={{ opacity: 0, visibility: "hidden", position: "absolute", inset: 0, zIndex: -1 }}
        />
      </div>
    );
  }

  // Xử lý click vào GitHub link (mở tab mới)
  const handleGitHubClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Xử lý click vào Live Demo (mở modal với iframe)
  const handleLiveDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect('demo'); // Mở modal ở chế độ demo
  };

  // Xử lý click vào card (mở modal ở chế độ info)
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn scroll restoration
    onSelect('info'); // Mở modal ở chế độ info
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        className={styles.projectCard}
        style={{ opacity: 0, visibility: "hidden", position: "absolute", inset: 0, zIndex: -1 }}
      />

      <motion.div
        layoutId={`project-card-${index}`}
        className={styles.projectCard}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.projectImageWrapper}>
          <ParallaxImage
            src={project.image}
            alt={project.title}
            speed={0.05}
            aspectRatio="auto"
            style={{ height: "100%", width: "100%" }}
          />
          <div className={styles.projectOverlay} />
        </div>

        <div className={styles.projectContent}>
          <div className={styles.projectHeader}>
            <div className={styles.projectTags}>
              {project.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className={styles.projectTag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.projectActions}>
              {/* GitHub stats nếu có */}
              {(project.stars !== undefined || project.forks !== undefined) && (
                <div className={styles.projectStats}>
                  {project.stars !== undefined && project.stars > 0 && (
                    <span className={styles.projectStat}>
                      <Star className="w-3.5 h-3.5" />
                      {project.stars}
                    </span>
                  )}
                  {project.forks !== undefined && project.forks > 0 && (
                    <span className={styles.projectStat}>
                      <GitFork className="w-3.5 h-3.5" />
                      {project.forks}
                    </span>
                  )}
                </div>
              )}
              {/* GitHub link */}
              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  className={styles.projectLink}
                  onClick={(e) => handleGitHubClick(e, project.githubUrl)}
                  aria-label="View on GitHub"
                >
                  <Github className="w-5 h-5" />
                </Button>
              )}
              {/* Live demo link - Mở modal với iframe */}
              {project.liveUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  className={styles.projectLink}
                  onClick={handleLiveDemoClick}
                  aria-label="View live demo"
                >
                  <ExternalLink className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          <div className={styles.projectInfo}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.projectAction}>
              <span className={styles.viewCaseText}>{viewCaseText}</span>
              <ArrowRight className={styles.arrowIcon} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
