import { useState } from "react";
import type { Route } from "./+types/home";
import styles from "./home.module.css";
import { Navigation } from "~/components/navigation/navigation";
import { ScrollyTelling } from "~/components/ui/scrolly-telling/scrolly-telling";
import { useLanguage } from "~/contexts/language";
import { fetchFeaturedProjects, type FeaturedProject } from "~/services/github-projects.server";

// Section Components
import { HeroSection } from "~/components/hero-section";
import { SkillsSection } from "~/components/skills-section";
import { ExperienceSection } from "~/components/experience-section";
import { ProjectsSection } from "~/components/projects-section";
import { TestimonialsSection } from "~/components/testimonials-section";
import { CTASection } from "~/components/cta-section";
import { SiteFooter } from "~/components/site-footer";
import { ContactModal } from "~/components/contact-modal";
import { ProjectModal } from "~/components/project-modal";
import { BackToTop } from "~/components/back-to-top";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "VuongTech - Creative Developer & Designer" },
    {
      name: "description",
      content: "A modern, artistic portfolio showcasing creative work and projects",
    },
  ];
}

// Loader để fetch GitHub projects từ server
export async function loader({ request, context }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const langMatch = cookieHeader.match(/preferred-language=(en|vi)/);
  const language = (langMatch?.[1] as "en" | "vi") || "en";

  try {
    // Pass context.cloudflare.env to access Cloudflare environment variables
    const env = context.cloudflare?.env as Record<string, unknown> | undefined;
    const projects = await fetchFeaturedProjects(language, env);
    return { projects, error: null };
  } catch (error) {
    console.error("Failed to fetch GitHub projects:", error);
    return { projects: [], error: "Failed to load projects" };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectInitialView, setProjectInitialView] = useState<'info' | 'demo'>('info');
  const { t, language } = useLanguage();

  // Projects từ GitHub loader
  const githubProjects = loaderData?.projects || [];

  // Handler để mở project với view cụ thể
  const handleSelectProject = (index: number, view: 'info' | 'demo' = 'info') => {
    setProjectInitialView(view);
    setSelectedProject(index);
  };

  // Process items with translations (for ScrollyTelling)
  const processItems = [
    {
      title: t.process.discovery.title,
      text: t.process.discovery.text,
      visual: <ProcessVisual imageSrc="/images/process/discovery.png" alt="Discovery" />,
    },
    {
      title: t.process.strategy.title,
      text: t.process.strategy.text,
      visual: <ProcessVisual imageSrc="/images/process/strategy.png" alt="Strategy" />,
    },
    {
      title: t.process.creation.title,
      text: t.process.creation.text,
      visual: <ProcessVisual imageSrc="/images/process/creation.png" alt="Creation" />,
    },
    {
      title: t.process.refinement.title,
      text: t.process.refinement.text,
      visual: <ProcessVisual imageSrc="/images/process/refinement.png" alt="Refinement" />,
    },
  ];

  // Chuyển đổi GitHub projects sang format component cần
  const projects = githubProjects.map((p: FeaturedProject) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    stars: p.stars,
    forks: p.forks,
    language: p.language,
    features: p.features,
    techStack: p.techStack,
  }));

  return (
    <div className={styles.page}>
      <Navigation />

      <HeroSection />

      <ScrollyTelling items={processItems} />

      <SkillsSection />

      <ExperienceSection />

      <ProjectsSection
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        projects={projects}
      />

      <TestimonialsSection />

      <CTASection
        isContactOpen={isContactOpen}
        onContactOpenChange={setIsContactOpen}
      />

      <SiteFooter />

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

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

/** Component hiển thị visual cho process items */
interface ProcessVisualProps {
  imageSrc: string;
  alt: string;
}

function ProcessVisual({ imageSrc, alt }: ProcessVisualProps) {
  return (
    <img
      src={imageSrc}
      alt={alt}
      className="process-visual-image"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%",
      }}
    />
  );
}
