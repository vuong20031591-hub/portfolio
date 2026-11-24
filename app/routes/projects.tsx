import { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  GitFork,
  LayoutGrid,
  LayoutList,
  Star,
} from "lucide-react";
import type { Route } from "./+types/projects";
import styles from "./projects.module.css";
import { Navigation } from "~/components/navigation/navigation";
import { Button } from "~/components/ui/button/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { GridSkeleton } from "~/components/ui/skeleton";
import { CurvedDivider } from "~/components/ui/curved-divider";
import { CTASection } from "~/components/cta-section";
import { SiteFooter } from "~/components/site-footer";
import { ContactModal } from "~/components/contact-modal";
import { ProjectModal } from "~/components/project-modal";
import { BackToTop } from "~/components/back-to-top";
import { useLanguage } from "~/contexts/language";
import { fetchFeaturedProjects, type FeaturedProject } from "~/services/github-projects.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects - VuongTech" },
    {
      name: "description",
      content: "Explore my portfolio of creative projects and development work",
    },
  ];
}

// Loader để fetch GitHub projects từ server
export async function loader({ request, context }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const langMatch = cookieHeader.match(/preferred-language=(en|vi)/);
  const language = (langMatch?.[1] as "en" | "vi") || "en";

  try {
    const cloudflareContext = context as { cloudflare?: { env?: Record<string, unknown> } };
    const env = cloudflareContext.cloudflare?.env;

    const projects = await fetchFeaturedProjects(language, env);

    if (projects.length === 0) {
      const { getEnv } = await import("~/lib/env.server");
      const token = getEnv("GITHUB_TOKEN", env);
      if (!token) {
        return {
          projects: [],
          error: "GitHub token not configured. Please contact administrator.",
        };
      }
    }

    return { projects, error: null };
  } catch (error) {
    console.error("Projects loader error:", error);
    return { projects: [], error: "Failed to load projects" };
  }
}

export default function Projects() {
  const { t, language } = useLanguage();
  const { projects: rawProjects, error } = useLoaderData<typeof loader>();

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectInitialView, setProjectInitialView] = useState<"info" | "demo">("info");
  const [isContactOpen, setIsContactOpen] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const closingBandRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: closingProgress } = useScroll({
    target: closingBandRef,
    offset: ["start end", "end end"],
  });
  const closingParallaxY = useTransform(closingProgress, [0, 1], [-64, 0]);

  const projects = useMemo(
    () =>
      (rawProjects || []).map((p: FeaturedProject) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image,
        tags: p.tags,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        embed: p.embed,
        stars: p.stars,
        forks: p.forks,
        language: p.language,
        features: p.features,
        techStack: p.techStack,
      })),
    [rawProjects]
  );

  // Rút trích các nhóm ngôn ngữ / stack chính để lọc nhanh
  const filterOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      const key = p.language?.trim();
      if (key) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ id: name, label: name, count }));

    return [
      { id: "all", label: language === "vi" ? "Tất cả" : "All", count: projects.length },
      ...sorted,
    ];
  }, [projects, language]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => p.language === activeFilter);
  }, [projects, activeFilter]);

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

  // Reset hover khi đổi filter hoặc chế độ xem
  useEffect(() => {
    setHoveredIndex(null);
  }, [activeFilter, viewMode]);

  // Lerp mượt khung preview nổi theo con trỏ chuột (List mode trên desktop)
  useEffect(() => {
    if (!canHover || viewMode !== "list" || hoveredIndex === null) {
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
  }, [canHover, viewMode, hoveredIndex]);

  const handleListMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || viewMode !== "list" || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (hoveredIndex === null) {
      currentPos.current = { x, y };
    }
    targetPos.current = { x, y };
  };

  const openProjectModal = (projectId: number | string | undefined, view: "info" | "demo" = "info") => {
    const idx = projects.findIndex((p) => p.id === projectId);
    if (idx >= 0) {
      setProjectInitialView(view);
      setSelectedProject(idx);
    }
  };

  const handleGitHubClick = (e: React.MouseEvent, url?: string | null) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleLiveDemoClick = (
    e: React.MouseEvent,
    project: (typeof projects)[number]
  ) => {
    e.stopPropagation();
    if (project.embed === false && project.liveUrl) {
      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
      return;
    }
    openProjectModal(project.id, "demo");
  };

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        {/* Editorial Hero Header */}
        <header className={styles.hero}>
          <ScrollReveal variant="fade-up" width="100%">
            <span className={styles.eyebrow}>
              {language === "vi" ? "LƯU TRỮ DỰ ÁN" : "SELECTED ARCHIVE"}
            </span>
            <h1 className={styles.title}>{t.projectsPage.title}</h1>
            <p className={styles.subtitle}>{t.projectsPage.subtitle}</p>
          </ScrollReveal>
        </header>

        {/* Toolbar: Filter Pills + List/Grid Toggle (Dennis Snellenberg /work style) */}
        {projects.length > 0 && (
          <div className={styles.toolbar}>
            <div className={styles.filters} role="tablist" aria-label="Filter projects">
              {filterOptions.map((opt) => {
                const isActive = activeFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ""}`}
                    onClick={() => setActiveFilter(opt.id)}
                  >
                    <span>{opt.label}</span>
                    <sup className={styles.filterCount}>{opt.count}</sup>
                  </button>
                );
              })}
            </div>

            <div className={styles.viewToggle} role="group" aria-label="View mode">
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
                onClick={() => setViewMode("list")}
                aria-label={language === "vi" ? "Xem dạng danh sách" : "List view"}
                aria-pressed={viewMode === "list"}
              >
                <LayoutList size={18} />
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label={language === "vi" ? "Xem dạng lưới" : "Grid view"}
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Projects Content */}
        <section className={styles.projectsSection}>
          {error && (
            <div className={styles.errorMessage}>
              <p>
                {t.common.error}: {error}
              </p>
            </div>
          )}

          {projects.length === 0 && !error && <GridSkeleton cards={6} columns={2} />}

          {filteredProjects.length > 0 && viewMode === "list" && (
            <div
              ref={listRef}
              className={styles.listWrapper}
              onMouseMove={handleListMouseMove}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Column header labels (Desktop) */}
              <div className={styles.listHeader} aria-hidden="true">
                <span>{language === "vi" ? "DỰ ÁN" : "PROJECT"}</span>
                <span>{language === "vi" ? "CÔNG NGHỆ & LIÊN KẾT" : "STACK & LINKS"}</span>
              </div>

              {/* Floating Hover Preview */}
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
                    {filteredProjects.map((project, idx) => (
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
                {filteredProjects.map((project, index) => {
                  const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
                  const formattedIndex = String(index + 1).padStart(2, "0");

                  return (
                    <div
                      key={project.id ?? index}
                      className={`${styles.row} ${isDimmed ? styles.rowDimmed : ""}`}
                      role="button"
                      tabIndex={0}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onFocus={() => setHoveredIndex(index)}
                      onClick={() => openProjectModal(project.id, "info")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openProjectModal(project.id, "info");
                        }
                      }}
                      aria-label={`${project.title} — ${t.projects.viewCase}`}
                    >
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
                          <h2 className={styles.rowTitle}>{project.title}</h2>
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
                          {project.stars !== undefined && project.stars > 0 && (
                            <span className={styles.rowStat}>
                              <Star className="w-3.5 h-3.5" />
                              {project.stars}
                            </span>
                          )}
                          {project.forks !== undefined && project.forks > 0 && (
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
                              aria-label={t.projectModal.viewOnGithub}
                            >
                              <Github className="w-4 h-4" />
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button
                              variant="outline"
                              size="icon"
                              className={styles.actionBtn}
                              onClick={(e) => handleLiveDemoClick(e, project)}
                              aria-label={t.projects.viewLive}
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
                })}
              </div>
            </div>
          )}

          {filteredProjects.length > 0 && viewMode === "grid" && (
            <div className={styles.editorialGrid}>
              {filteredProjects.map((project, index) => (
                <ScrollReveal key={project.id ?? index} variant="fade-up" delay={index * 0.05} width="100%">
                  <article
                    className={styles.gridItem}
                    role="button"
                    tabIndex={0}
                    onClick={() => openProjectModal(project.id, "info")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openProjectModal(project.id, "info");
                      }
                    }}
                  >
                    <div className={styles.gridThumbWrap}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className={styles.gridThumb}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className={styles.gridHeader}>
                      <h2 className={styles.gridTitle}>{project.title}</h2>
                      <span className={styles.gridArrow} aria-hidden="true">
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>

                    <p className={styles.gridDescription}>{project.description}</p>

                    <div className={styles.gridFooter}>
                      <div className={styles.gridTags}>
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.rowTag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={styles.rowActions}>
                        {project.githubUrl && (
                          <Button
                            variant="outline"
                            size="icon"
                            className={styles.actionBtn}
                            onClick={(e) => handleGitHubClick(e, project.githubUrl)}
                            aria-label={t.projectModal.viewOnGithub}
                          >
                            <Github className="w-4 h-4" />
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button
                            variant="outline"
                            size="icon"
                            className={styles.actionBtn}
                            onClick={(e) => handleLiveDemoClick(e, project)}
                            aria-label={t.projects.viewLive}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Viền cong chuyển cảnh → CTA & Footer đồng nhất với trang chủ */}
      <div ref={closingBandRef} className={styles.closingBand}>
        <CurvedDivider
          topColor="var(--color-neutral-1)"
          bottomColor="var(--closing-bg)"
          maxHeight={200}
        />
        <motion.div
          className={styles.closingReveal}
          style={{ y: prefersReducedMotion ? 0 : closingParallaxY }}
        >
          <CTASection
            isContactOpen={isContactOpen}
            onContactOpenChange={setIsContactOpen}
          />
          <SiteFooter />
        </motion.div>
      </div>

      {/* Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ProjectModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
        projects={projects}
        initialView={projectInitialView}
      />

      <BackToTop />
    </div>
  );
}
