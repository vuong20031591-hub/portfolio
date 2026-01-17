import type { Route } from "./+types/projects";
import styles from "./projects.module.css";
import { Navigation } from "~/components/navigation/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { Button } from "~/components/ui/button/button";
import { ExternalLink, Github, Star, GitFork } from "lucide-react";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { ParallaxImage } from "~/components/ui/parallax-image";
import { useLanguage } from "~/contexts/language";
import { fetchFeaturedProjects, type FeaturedProject } from "~/services/github-projects.server";
import { useLoaderData } from "react-router";
import { GridSkeleton } from "~/components/ui/skeleton";

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
  // Set Cloudflare context for env access
  if (context?.cloudflare?.env) {
    const { setRequestContext } = await import("~/lib/env.server");
    setRequestContext({ env: context.cloudflare.env });
  }

  const cookieHeader = request.headers.get("Cookie") || "";
  const langMatch = cookieHeader.match(/preferred-language=(en|vi)/);
  const language = (langMatch?.[1] as "en" | "vi") || "en";

  try {
    const projects = await fetchFeaturedProjects(language);
    return { projects, error: null };
  } catch (error) {
    console.error("Failed to fetch GitHub projects:", error);
    return { projects: [], error: "Failed to load projects" };
  } finally {
    // Clear context after request
    if (context?.cloudflare?.env) {
      const { clearRequestContext } = await import("~/lib/env.server");
      clearRequestContext();
    }
  }
}

export default function Projects() {
  const { t } = useLanguage();
  const { projects, error } = useLoaderData<typeof loader>();

  return (
    <div className={styles.page}>
      <Navigation />

      <section className={styles.hero}>
        <ScrollReveal variant="fade-up" width="100%">
          <h1 className={styles.title}>{t.projectsPage.title}</h1>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={0.2} width="100%">
          <p className={styles.subtitle}>{t.projectsPage.subtitle}</p>
        </ScrollReveal>
      </section>

      <section className={styles.projectsSection}>
        {error && (
          <div className={styles.errorMessage}>
            <p>{t.common.error}: {error}</p>
          </div>
        )}

        {projects.length === 0 && !error && (
          <GridSkeleton cards={6} columns={3} />
        )}

        {projects.length > 0 && (
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <ScrollReveal key={project.id} variant="fade-up" delay={index * 0.1} width="100%">
                <Card className={styles.projectCard}>
                  <div className={styles.projectImage}>
                    <ParallaxImage
                      src={project.image}
                      alt={project.title}
                      speed={0.1}
                      aspectRatio="auto"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent style={{ marginTop: "auto" }}>
                    <div className={styles.projectStats}>
                      <span className={styles.stat}>
                        <Star size={14} />
                        {project.stars}
                      </span>
                      <span className={styles.stat}>
                        <GitFork size={14} />
                        {project.forks}
                      </span>
                      {project.language && (
                        <span className={styles.language}>{project.language}</span>
                      )}
                    </div>
                    <div className={styles.tags}>
                      {project.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-3)" }}>
                      {project.liveUrl && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => window.open(project.liveUrl!, "_blank", "noopener,noreferrer")}
                        >
                          <ExternalLink />
                          {t.projects.viewLive}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.githubUrl, "_blank", "noopener,noreferrer")}
                      >
                        <Github />
                        {t.projects.code}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
