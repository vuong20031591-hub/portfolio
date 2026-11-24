import { useEffect, useState } from "react";
import { ExternalLink, ArrowRight, Github, Star, GitFork, Pause, Play } from "lucide-react";
import { Button } from "~/components/ui/button/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import { GridSkeleton } from "~/components/ui/skeleton";
import styles from "./projects-section.module.css";
import type { ProjectsSectionProps, ProjectItem } from "./projects-section.types";

/**
 * Theo dõi prefers-reduced-motion và khả năng hover để quyết định
 * có chạy marquee tự động hay dùng cuộn ngang thủ công.
 */
function useMarqueePreferences() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () => {
      setReduceMotion(motionQuery.matches);
      setCanHover(hoverQuery.matches);
    };

    update();
    motionQuery.addEventListener("change", update);
    hoverQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      hoverQuery.removeEventListener("change", update);
    };
  }, []);

  return { reduceMotion, canHover };
}

/**
 * ProjectsSection - Dải project chạy ngang, lặp liền mạch
 */
export function ProjectsSection({
  className,
  onSelectProject,
  selectedProject,
  projects = [],
}: ProjectsSectionProps) {
  const { t } = useLanguage();
  const { reduceMotion, canHover } = useMarqueePreferences();
  const [isPaused, setIsPaused] = useState(false);

  const handleSelectProject = (index: number, view: 'info' | 'demo' = 'info') => {
    onSelectProject?.(index, view);
  };

  const autoRun = canHover && !reduceMotion && projects.length > 2;
  const isPausedNow = isPaused || selectedProject !== null;

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

  const renderCard = (project: ProjectItem, index: number, isClone = false) => (
    <ProjectCard
      key={`${isClone ? "clone" : "card"}-${project.id ?? index}`}
      project={project}
      index={index}
      onSelect={(view) => handleSelectProject(index, view)}
      viewCaseText={t.projects.viewCase}
      viewGithubText={t.projectModal.viewOnGithub}
      viewDemoText={t.projects.viewLive}
      isClone={isClone}
    />
  );

  return (
    <section className={`${styles.section} ${className ?? ""}`} id="projects">
      <ScrollReveal variant="fade-up" width="100%">
        <h2 className={styles.sectionTitle}>{t.projects.title}</h2>
        <p className={styles.sectionSubtitle}>{t.projects.subtitle}</p>
      </ScrollReveal>

      <div className={`${styles.marqueeViewport} ${autoRun ? "" : styles.marqueeStatic}`}>
        <div
          className={`${styles.marqueeTrack} ${isPausedNow ? styles.marqueePaused : ""}`}
          style={autoRun ? { animationDuration: `${projects.length * 9}s` } : undefined}
        >
          <div className={styles.marqueeGroup}>
            {projects.map((project, index) => renderCard(project, index))}
          </div>

          {autoRun && (
            <div className={styles.marqueeGroup} aria-hidden="true" inert>
              {projects.map((project, index) => renderCard(project, index, true))}
            </div>
          )}
        </div>
      </div>

      {autoRun && (
        <div className={styles.marqueeControls}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-pressed={isPaused}
          >
            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
            {isPaused ? t.projects.play : t.projects.pause}
          </Button>
        </div>
      )}
    </section>
  );
}

/** Props cho ProjectCard */
interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  onSelect: (view?: 'info' | 'demo') => void;
  viewCaseText: string;
  viewGithubText: string;
  viewDemoText: string;
  isClone?: boolean;
}

/** Component hiển thị một project card */
function ProjectCard({
  project,
  index,
  onSelect,
  viewCaseText,
  viewGithubText,
  viewDemoText,
  isClone = false,
}: ProjectCardProps) {
  // Xử lý click vào GitHub link (mở tab mới)
  const handleGitHubClick = (e: React.MouseEvent, url?: string | null) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Xử lý click vào Live Demo: nhúng iframe nếu site cho phép, ngược lại mở tab mới
  const handleLiveDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.embed === false && project.liveUrl) {
      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
      return;
    }
    onSelect('demo'); // Mở modal ở chế độ demo
  };

  // Xử lý mở chi tiết project
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn scroll restoration
    onSelect('info');
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect('info');
    }
  };

  const cardContent = (
    <>
      <div className={styles.projectImageWrapper}>
        <img
          src={project.image}
          alt={project.title}
          className={styles.projectImage}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.projectOverlay} />
      </div>

      <div className={styles.projectActions}>
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
        {project.githubUrl && (
          <Button
            variant="outline"
            size="icon"
            className={styles.projectLink}
            onClick={(e) => handleGitHubClick(e, project.githubUrl)}
            aria-label={viewGithubText}
            tabIndex={isClone ? -1 : undefined}
          >
            <Github className="w-5 h-5" />
          </Button>
        )}
        {project.liveUrl && (
          <Button
            variant="outline"
            size="icon"
            className={styles.projectLink}
            onClick={handleLiveDemoClick}
            aria-label={viewDemoText}
            tabIndex={isClone ? -1 : undefined}
          >
            <ExternalLink className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className={styles.projectContent}>
        <div className={styles.projectTags}>
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className={styles.projectTag}>
              {tag}
            </span>
          ))}
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
    </>
  );

  return (
    <div className={styles.marqueeCard}>
      {isClone ? (
        <div className={styles.projectCard}>{cardContent}</div>
      ) : (
        <div
          className={styles.projectCard}
          role="button"
          tabIndex={0}
          onClick={handleCardClick}
          onKeyDown={handleCardKeyDown}
          aria-label={`${project.title} — ${viewCaseText}`}
        >
          {cardContent}
        </div>
      )}
    </div>
  );
}
