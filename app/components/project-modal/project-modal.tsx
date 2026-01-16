import React, { useState } from "react";
import { X, Github, Star, GitFork, Monitor, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button/button";
import { useLanguage } from "~/contexts/language";
import styles from "./project-modal.module.css";
import type { ProjectModalProps } from "./project-modal.types";

/**
 * ProjectModal - Modal hiển thị chi tiết project với animation expand
 */
export function ProjectModal({ selectedProject, onClose, projects, initialView = 'info' }: ProjectModalProps) {
  const { t } = useLanguage();
  const project = selectedProject !== null ? projects[selectedProject] : null;
  const [showIframe, setShowIframe] = useState(initialView === 'demo');

  // Reset showIframe khi selectedProject hoặc initialView thay đổi
  React.useEffect(() => {
    setShowIframe(initialView === 'demo');
  }, [selectedProject, initialView]);

  // Thêm/xóa class vào body để ẩn backToTop và scroll
  React.useEffect(() => {
    if (selectedProject !== null) {
      // Lưu scroll position hiện tại
      const scrollY = window.scrollY;
      
      const className = showIframe ? 'modal-iframe-active' : 'modal-info-active';
      document.body.classList.add(className);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Khôi phục scroll position sau khi set overflow hidden
      window.scrollTo(0, scrollY);
      
      return () => {
        document.body.classList.remove(className);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        // Khôi phục scroll position khi đóng modal
        window.scrollTo(0, scrollY);
      };
    }
  }, [showIframe, selectedProject]);

  const handleExternalClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShowDemo = () => {
    setShowIframe(true);
  };

  const handleCloseDemo = () => {
    setShowIframe(false);
  };

  const handleClose = () => {
    setShowIframe(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {selectedProject !== null && project && (
        <div className={styles.fullscreenOverlay} style={{ zIndex: 100 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className={styles.backdrop}
          />
          <motion.div
            layoutId={`project-card-${selectedProject}`}
            className={styles.expandedCard}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 0,
              background: "var(--color-neutral-1)",
              overflow: "hidden",
            }}
          >
            {!showIframe && (
              <button
                className={styles.closeButton}
                onClick={handleClose}
                style={{ zIndex: 50 }}
              >
                <X />
              </button>
            )}

            {/* Toggle button giữa Info và Demo */}
            {project.liveUrl && (
              <div className={`${styles.viewToggle} ${showIframe ? styles.viewToggleBottom : ''}`}>
                <Button
                  variant={!showIframe ? "default" : "outline"}
                  size="sm"
                  onClick={handleCloseDemo}
                  className={styles.toggleButton}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Thông tin
                </Button>
                <Button
                  variant={showIframe ? "default" : "outline"}
                  size="sm"
                  onClick={handleShowDemo}
                  className={styles.toggleButton}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              </div>
            )}

            {showIframe && project.liveUrl ? (
              <IframePreview url={project.liveUrl} />
            ) : (
              <ModalContent 
                project={project} 
                t={t} 
                onExternalClick={handleExternalClick}
                onShowDemo={handleShowDemo}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


/** Component hiển thị iframe preview */
interface IframePreviewProps {
  url: string;
}

function IframePreview({ url }: IframePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.iframeContainer}
    >
      <iframe
        src={url}
        className={styles.iframe}
        title="Live Demo Preview"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        loading="lazy"
      />
    </motion.div>
  );
}

interface ModalContentProps {
  project: ProjectModalProps["projects"][0];
  t: ReturnType<typeof useLanguage>["t"];
  onExternalClick: (url: string) => void;
  onShowDemo: () => void;
}

function ModalContent({ project, t, onExternalClick, onShowDemo }: ModalContentProps) {
  return (
    <div className={styles.expandedProjectContainer}>
      <div className={styles.expandedProjectImageHeader}>
        <img
          src={project.image}
          className={styles.expandedProjectImage}
          alt={project.title}
        />
        <div className={styles.projectOverlay} />
        <div className={styles.imageHeaderContent}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.expandedProjectTitle}
          >
            {project.title}
          </motion.h2>
        </div>
      </div>

      <motion.div
        className={styles.expandedProjectBody}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.expandedProjectTags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.expandedProjectTag}>
              {tag}
            </span>
          ))}
        </div>

        <GitHubStats project={project} />

        <p className={styles.expandedProjectDescription}>
          {project.description}
        </p>

        <div style={{ height: "2rem" }} />

        <div className={styles.caseStudyGrid}>
          <ProjectFeatures project={project} t={t} />
          <ProjectSidebar 
            project={project} 
            t={t} 
            onExternalClick={onExternalClick}
            onShowDemo={onShowDemo}
          />
        </div>
      </motion.div>
    </div>
  );
}


interface GitHubStatsProps {
  project: ProjectModalProps["projects"][0];
}

function GitHubStats({ project }: GitHubStatsProps) {
  const hasStats = project.stars !== undefined || project.forks !== undefined;
  if (!hasStats) return null;

  return (
    <div className={styles.githubStats}>
      {project.stars !== undefined && (
        <span className={styles.githubStat}>
          <Star className="w-4 h-4" />
          {project.stars} stars
        </span>
      )}
      {project.forks !== undefined && (
        <span className={styles.githubStat}>
          <GitFork className="w-4 h-4" />
          {project.forks} forks
        </span>
      )}
      {project.language && (
        <span className={styles.githubStat}>
          <span className={styles.languageDot} />
          {project.language}
        </span>
      )}
    </div>
  );
}

interface ProjectFeaturesProps {
  project: ProjectModalProps["projects"][0];
  t: ReturnType<typeof useLanguage>["t"];
}

function ProjectFeatures({ project, t }: ProjectFeaturesProps) {
  return (
    <div className={styles.caseStudyContent}>
      {project.features && project.features.length > 0 && (
        <div>
          <h3 className={styles.caseStudySectionTitle}>
            {t.projectModal.challenge}
          </h3>
          <ul className={styles.featuresList}>
            {project.features.map((feature, idx) => (
              <li key={idx} className={styles.featureItem}>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.techStack && project.techStack.length > 0 && (
        <div>
          <h3 className={styles.caseStudySectionTitle}>
            {t.projectModal.stack}
          </h3>
          <div className={styles.techStackGrid}>
            {project.techStack.map((tech, idx) => (
              <span key={idx} className={styles.techItem}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


interface ProjectSidebarProps {
  project: ProjectModalProps["projects"][0];
  t: ReturnType<typeof useLanguage>["t"];
  onExternalClick: (url: string) => void;
  onShowDemo: () => void;
}

function ProjectSidebar({ project, t, onExternalClick, onShowDemo }: ProjectSidebarProps) {
  return (
    <div className={styles.caseStudySidebar}>
      {project.language && (
        <div className={styles.projectStat}>
          <span className={styles.projectStatLabel}>Language</span>
          <span className={styles.projectStatValue}>{project.language}</span>
        </div>
      )}

      {project.stars !== undefined && (
        <div className={styles.projectStat}>
          <span className={styles.projectStatLabel}>GitHub Stars</span>
          <span className={styles.projectStatValue}>{project.stars}</span>
        </div>
      )}

      <div className={styles.projectStat}>
        <span className={styles.projectStatLabel}>{t.projectModal.role}</span>
        <span className={styles.projectStatValue}>Full-stack Developer</span>
      </div>

      <div className={styles.actionButtons}>
        {project.githubUrl && (
          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={() => onExternalClick(project.githubUrl!)}
          >
            <Github className="mr-2 w-4 h-4" />
            View on GitHub
          </Button>
        )}
        {project.liveUrl && (
          <Button
            className="w-full"
            size="lg"
            onClick={onShowDemo}
          >
            <Monitor className="mr-2 w-4 h-4" />
            {t.projectModal.visitLive}
          </Button>
        )}
      </div>
    </div>
  );
}
