import type { Route } from "./+types/about";
import styles from "./about.module.css";
import { Navigation } from "~/components/navigation/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { Code, Palette, Zap, Users } from "lucide-react";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { ParallaxImage } from "~/components/ui/parallax-image";
import { useLanguage } from "~/contexts/language";
import { GitHubStats, ContributionGraph } from "~/components/github-stats";
import { 
  fetchGitHubContributions, 
  fetchGitHubStats,
  type GitHubContributions,
  type GitHubStatsData 
} from "~/services/github.server";
import { useLoaderData } from "react-router";

// GitHub username constant
const GITHUB_USERNAME = "vuong20031591-hub";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - VuongTech" },
    {
      name: "description",
      content: "Learn more about my background, skills, and experience",
    },
  ];
}

/**
 * Server-side loader to fetch GitHub data
 * This runs on the server and has access to environment variables
 */
export async function loader({ context }: Route.LoaderArgs): Promise<{ 
  contributions: GitHubContributions;
  stats: GitHubStatsData;
}> {
  // Access Cloudflare Secrets via context.cloudflare.env
  const cloudflareContext = context as { cloudflare?: { env?: Record<string, unknown> } };
  const env = cloudflareContext.cloudflare?.env;
  
  // Fetch both contributions and stats in parallel
  const [contributions, stats] = await Promise.all([
    fetchGitHubContributions(GITHUB_USERNAME, env),
    fetchGitHubStats(GITHUB_USERNAME, env),
  ]);
  
  return { contributions, stats };
}

export default function About() {
  const { t } = useLanguage();
  const { contributions, stats } = useLoaderData<typeof loader>();

  const skills = [
    {
      icon: <Code />,
      title: t.about.skills.frontend.title,
      description: t.about.skills.frontend.description,
    },
    {
      icon: <Palette />,
      title: t.about.skills.design.title,
      description: t.about.skills.design.description,
    },
    {
      icon: <Zap />,
      title: t.about.skills.performance.title,
      description: t.about.skills.performance.description,
    },
    {
      icon: <Users />,
      title: t.about.skills.collaboration.title,
      description: t.about.skills.collaboration.description,
    },
  ];

  return (
    <div className={styles.page}>
      <Navigation />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <ScrollReveal variant="scale" delay={0.2} className={styles.imageContainer} width="100%">
            <ParallaxImage
              src="/images/hero-portrait.jpg"
              alt="About me"
              aspectRatio="4/5"
              style={{ height: "100%" }}
            />
          </ScrollReveal>

          <div className={styles.content}>
            <ScrollReveal variant="fade-up" delay={0.4}>
              <h1 className={styles.title}>{t.about.title}</h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.5}>
              <p className={styles.text}>{t.about.text1}</p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.6}>
              <p className={styles.text}>{t.about.text2}</p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.7}>
              <p className={styles.text}>{t.about.text3}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className={styles.skillsSection}>
        <ScrollReveal variant="fade-up" width="100%">
          <h2 className={styles.sectionTitle}>{t.about.skillsTitle}</h2>
        </ScrollReveal>
        <div className={styles.skillsGrid}>
          {skills.map((skill, index) => (
            <ScrollReveal key={index} variant="fade-up" delay={index * 0.1} width="100%">
              <Card style={{ height: "100%" }}>
                <CardHeader>
                  <div style={{ color: "var(--color-accent-9)", marginBottom: "var(--space-3)" }}>{skill.icon}</div>
                  <CardTitle>{skill.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{skill.description}</CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className={styles.githubSection}>
        <ScrollReveal variant="fade-up" width="100%">
          <h2 className={styles.sectionTitle}>{t.github.title}</h2>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={0.2} width="100%">
          <GitHubStats username={GITHUB_USERNAME} data={stats} />
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={0.3} width="100%">
          <ContributionGraph 
            username={GITHUB_USERNAME}
            data={contributions.contributions}
            totalContributions={contributions.totalContributions}
            error={contributions.error}
          />
        </ScrollReveal>
      </section>
    </div>
  );
}
