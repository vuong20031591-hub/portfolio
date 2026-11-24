import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ExternalLink, Github, Star, GitFork } from "lucide-react";
import { Button } from "~/components/ui/button/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import { GridSkeleton } from "~/components/ui/skeleton";
import styles from "./projects-section.module.css";
import type { ProjectsSectionProps, ProjectItem } from "./projects-section.types";

/**
 * ProjectsSection — Editorial Hover-Preview List (inspired by Dennis Snellenberg)
 * - Desktop: danh sách hàng ngang tinh gọn + khung ảnh preview nổi bám theo con trỏ chuột
 * - Mobile / Touch: hiển thị ảnh thumbnail trực tiếp trên từng item
 */
export function ProjectsSection({
  className,
  onSelectProject,
  projects = [],
}: ProjectsSectionProps) {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setCanHover(hoverQuery.matches && !motionQuery.matches);
    };

    update();
    hoverQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      hoverQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  // Lerp mượt vị trí khung ảnh preview theo con trỏ chuột
  useEffect(() => {
    if (!canHover || hoveredIndex === null) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const animate = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.14;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.14;

      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${currentPos.current.x.toFixed(1)}px, ${currentPos.current.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canHover, hoveredIndex]);

  const handleListMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Khởi tạo vị trí tức thì ở frame đầu tiên để tránh giật từ (0, 0)
    if (hoveredIndex === null) {
      currentPos.current = { x, y };
    }
    targetPos.current = { x, y };
  };

  const handleSelectProject = (index: number, view: "info" | "demo" = "info") => {
    onSelectProject?.(index, view);
  };

  const visibleProjects = projects.slice(0, 4);

  if (projects.length === 0) {
    return (
      <section className={`${styles.section} ${className ?? ""}`} id="projects">
        <div className={styles.inner}>
          <header className={styles.sectionHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.eyebrow}>05</span>
              <h2 className={styles.sectionTitle}>{t.projects.title}</h2>
            </div>
            <p className={styles.sectionSubtitle}>{t.projects.subtitle}</p>
          </header>
          <GridSkeleton cards={4} columns={2} />
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.section} ${className ?? ""}`} id="projects">
      <div className={styles.inner}>
        <ScrollReveal variant="fade-up" width="100%">
          <header className={styles.sectionHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.eyebrow}>05</span>
              <h2 className={styles.sectionTitle}>{t.projects.title}</h2>
            </div>
            <p className={styles.sectionSubtitle}>{t.projects.subtitle}</p>
          </header>
        </ScrollReveal>

        <div
          ref={listRef}
          className={styles.listWrapper}
          onMouseMove={handleListMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Floating Hover Preview (Desktop only) */}
          {canHover && (
            <div
              ref={previewRef}
              className={`${styles.floatingPreview} ${hoveredIndex !== null ? styles.floatingPreviewVisible : ""}`}
              aria-hidden="true"
            >
              <div
                className={styles.previewSlider}
                style={{
                  transform: `translate3d(0, -${(hoveredIndex ?? 0) * 100}%, 0)`,
                }}
              >
                {visibleProjects.map((project, idx) => (
                  <div key={project.id ?? idx} className={styles.previewSlide}>
                    <img
                      src={project.image}
                      alt=""
                      className={styles.previewImage}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.list}>
            {visibleProjects.map((project, index) => (
              <ProjectRow
                key={project.id ?? index}
                project={project}
                index={index}
                isDimmed={hoveredIndex !== null && hoveredIndex !== index}
                onHover={() => setHoveredIndex(index)}
                onSelect={(view) => handleSelectProject(index, view)}
                viewCaseText={t.projects.viewCase}
                viewGithubText={t.projectModal.viewOnGithub}
                viewDemoText={t.projects.viewLive}
              />
            ))}
          </div>
        </div>

        {/* Nút More work (kiểu Dennis Snellenberg) ngay phía trên viền cong */}
        {projects.length > 4 && (
          <div className={styles.moreWorkWrap}>
            <Link to="/projects" className={styles.moreWorkButton}>
              <span>{t.projects.moreWork}</span>
              <sup className={styles.moreWorkCount}>{projects.length}</sup>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

interface ProjectRowProps {
  project: ProjectItem;
  index: number;
  isDimmed: boolean;
  onHover: () => void;
  onSelect: (view?: "info" | "demo") => void;
  viewCaseText: string;
  viewGithubText: string;
  viewDemoText: string;
}

function ProjectRow({
  project,
  index,
  isDimmed,
  onHover,
  onSelect,
  viewCaseText,
  viewGithubText,
  viewDemoText,
}: ProjectRowProps) {
  const handleGitHubClick = (e: React.MouseEvent, url?: string | null) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleLiveDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.embed === false && project.liveUrl) {
      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
      return;
    }
    onSelect("demo");
  };

  const handleRowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect("info");
  };

  const handleRowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect("info");
    }
  };

  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`${styles.row} ${isDimmed ? styles.rowDimmed : ""}`}
      role="button"
      tabIndex={0}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      aria-label={`${project.title} — ${viewCaseText}`}
    >
      {/* Thumbnail trực tiếp cho mobile / thiết bị không hover */}
      <div className={styles.mobileThumbWrap}>
        <img
          src={project.image}
          alt={project.title}
          className={styles.mobileThumb}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={styles.rowMain}>
        <span className={styles.rowIndex}>{formattedIndex}</span>
        <div className={styles.rowHeading}>
          <h3 className={styles.rowTitle}>{project.title}</h3>
          <p className={styles.rowDescription}>{project.description}</p>
        </div>
      </div>

      <div className={styles.rowMeta}>
        <div className={styles.rowTags}>
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.rowTag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.rowActions}>
          {(project.stars !== undefined && project.stars > 0) && (
            <span className={styles.rowStat}>
              <Star className="w-3.5 h-3.5" />
              {project.stars}
            </span>
          )}
          {(project.forks !== undefined && project.forks > 0) && (
            <span className={styles.rowStat}>
              <GitFork className="w-3.5 h-3.5" />
              {project.forks}
            </span>
          )}
          {project.githubUrl && (
            <Button
              variant="outline"
              size="icon"
              className={styles.actionBtn}
              onClick={(e) => handleGitHubClick(e, project.githubUrl)}
              aria-label={viewGithubText}
            >
              <Github className="w-4 h-4" />
            </Button>
          )}
          {project.liveUrl && (
            <Button
              variant="outline"
              size="icon"
              className={styles.actionBtn}
              onClick={handleLiveDemoClick}
              aria-label={viewDemoText}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          <span className={styles.rowArrow} aria-hidden="true">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </div>
  );
}
