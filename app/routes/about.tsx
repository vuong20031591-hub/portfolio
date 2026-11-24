import { useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Route } from "./+types/about";
import styles from "./about.module.css";
import { Navigation } from "~/components/navigation/navigation";
import { Button } from "~/components/ui/button/button";
import { CurvedDivider } from "~/components/ui/curved-divider";
import { CTASection } from "~/components/cta-section";
import { SiteFooter } from "~/components/site-footer";
import { ContactModal } from "~/components/contact-modal";
import { BackToTop } from "~/components/back-to-top";
import { useLanguage } from "~/contexts/language";
import { GitHubStats, ContributionGraph } from "~/components/github-stats";
import {
  fetchGitHubContributions,
  fetchGitHubStats,
  type GitHubContributions,
  type GitHubStatsData,
} from "~/services/github.server";

const GITHUB_USERNAME = "vuong20031591-hub";
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - VuongTech" },
    {
      name: "description",
      content: "Learn more about my background, skills, and experience",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs): Promise<{
  contributions: GitHubContributions;
  stats: GitHubStatsData;
}> {
  const cloudflareContext = context as { cloudflare?: { env?: Record<string, unknown> } };
  const env = cloudflareContext.cloudflare?.env;

  const [contributions, stats] = await Promise.all([
    fetchGitHubContributions(GITHUB_USERNAME, env),
    fetchGitHubStats(GITHUB_USERNAME, env),
  ]);

  return { contributions, stats };
}

function HighlightWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className={styles.highlightWord}>
      {word}{" "}
    </motion.span>
  );
}

function ScrollWordHighlight({
  paragraphs,
  disabled,
}: {
  paragraphs: string[];
  disabled: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.55"],
  });

  if (disabled) {
    return (
      <div className={styles.storyCopy}>
        {paragraphs.map((text, idx) => (
          <p key={idx} className={styles.bodyText}>
            {text}
          </p>
        ))}
      </div>
    );
  }

  const tokenGroups = paragraphs.map((p) => p.split(/\s+/).filter(Boolean));
  const totalWords = tokenGroups.reduce((acc, g) => acc + g.length, 0);
  let cursor = 0;

  return (
    <div ref={containerRef} className={styles.storyCopy}>
      {tokenGroups.map((words, pIdx) => (
        <p key={pIdx} className={styles.bodyText}>
          {words.map((word, wIdx) => {
            const start = cursor / totalWords;
            const end = Math.min(1, (cursor + 1) / totalWords);
            cursor += 1;
            return (
              <HighlightWord
                key={`${pIdx}-${wIdx}`}
                word={word}
                progress={scrollYProgress}
                range={[start, end]}
              />
            );
          })}
        </p>
      ))}
    </div>
  );
}

export default function About() {
  const { t, language } = useLanguage();
  const { contributions, stats } = useLoaderData<typeof loader>();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const isVi = language === "vi";

  const closingBandRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: closingProgress } = useScroll({
    target: closingBandRef,
    offset: ["start end", "end end"],
  });
  const closingParallaxY = useTransform(closingProgress, [0, 1], [-64, 0]);

  const skills = [
    {
      title: t.about.skills.frontend.title,
      description: t.about.skills.frontend.description,
    },
    {
      title: t.about.skills.design.title,
      description: t.about.skills.design.description,
    },
    {
      title: t.about.skills.performance.title,
      description: t.about.skills.performance.description,
    },
    {
      title: t.about.skills.collaboration.title,
      description: t.about.skills.collaboration.description,
    },
  ];

  return (
    <div className={styles.page}>
      <Navigation />

      <main>
        {/* SCREEN 1: HERO — Choreographed entrance (mask-rise headline + curtain reveal photo) */}
        <section className={styles.heroSection}>
          <div className={styles.wrap}>
            <div className={styles.heroGrid}>
              <div className={styles.heroText}>
                <div className={styles.heroTop}>
                  <div className={styles.titleMask}>
                    <motion.h1
                      className={styles.heroTitle}
                      initial={prefersReducedMotion ? false : { y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ duration: 0.7, ease: EASE_OUT }}
                    >
                      {t.about.title}
                    </motion.h1>
                  </div>

                  <motion.p
                    className={styles.heroLead}
                    initial={prefersReducedMotion ? false : { y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.12, ease: EASE_OUT }}
                  >
                    {t.about.text1}
                  </motion.p>

                  <motion.div
                    className={styles.heroActions}
                    initial={prefersReducedMotion ? false : { y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.22, ease: EASE_OUT }}
                  >
                    <Button
                      size="lg"
                      className={styles.primaryAction}
                      onClick={() => setIsContactOpen(true)}
                    >
                      {t.cta.getInTouch}
                      <ArrowRight size={16} />
                    </Button>
                    <Button variant="outline" size="lg" className={styles.secondaryAction} asChild>
                      <Link to="/projects">{t.nav.projects}</Link>
                    </Button>
                  </motion.div>
                </div>

                <motion.dl
                  className={styles.heroFacts}
                  initial={prefersReducedMotion ? false : { y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.55, delay: 0.32, ease: EASE_OUT }}
                >
                  <div className={styles.fact}>
                    <dt>{t.hero.locationLabel}</dt>
                    <dd>{t.hero.locationValue}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>{isVi ? "Vai trò" : "Role"}</dt>
                    <dd>{t.hero.rolePrimary}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>GitHub</dt>
                    <dd>
                      <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.inlineLink}
                      >
                        @{GITHUB_USERNAME}
                      </a>
                    </dd>
                  </div>
                </motion.dl>
              </div>

              <motion.div
                className={styles.heroMedia}
                initial={
                  prefersReducedMotion
                    ? false
                    : { clipPath: "inset(10% 0% 0% 0% round 12px)", opacity: 0 }
                }
                animate={{ clipPath: "inset(0% 0% 0% 0% round 12px)", opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
              >
                <motion.img
                  src="/images/about/portrait-studio.webp"
                  alt="Nguyễn Tiến Vương"
                  className={styles.photo}
                  decoding="async"
                  initial={prefersReducedMotion ? false : { scale: 1.09 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.05, delay: 0.1, ease: EASE_OUT }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* SCREEN 2: APPROACH — Moment 1: picture-develops (film, 1.6s) + Moment 2: word-highlight (scroll) */}
        <section className={styles.storySection}>
          <div className={styles.wrap}>
            <h2 className={styles.sectionHeading}>
              {isVi ? "Cách mình làm việc" : "How I work"}
            </h2>

            <div className={styles.storyGrid}>
              <div className={styles.storyMedia}>
                <motion.img
                  src="/images/about/workspace.webp"
                  alt={isVi ? "Bàn làm việc lập trình tối giản" : "Minimalist developer workspace"}
                  className={styles.photo}
                  loading="lazy"
                  decoding="async"
                  initial={
                    prefersReducedMotion
                      ? false
                      : {
                          filter: "grayscale(1) contrast(0.72) brightness(1.18) blur(2px)",
                          scale: 1.05,
                        }
                  }
                  whileInView={{
                    filter: "grayscale(0) contrast(1) brightness(1) blur(0px)",
                    scale: 1,
                  }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 1.6, ease: EASE_OUT }}
                />
              </div>

              <ScrollWordHighlight
                paragraphs={[t.about.text2, t.about.text3]}
                disabled={Boolean(prefersReducedMotion)}
              />
            </div>
          </div>
        </section>

        {/* SCREEN 3: WHAT I BRING — 2x2 open grid (animated hairline hover) + curtain reveal craft photo */}
        <section className={styles.skillsSection}>
          <div className={styles.wrap}>
            <h2 className={styles.sectionHeading}>{t.about.skillsTitle}</h2>

            <div className={styles.skillsLayout}>
              <div className={styles.skillsGrid}>
                {skills.map((skill) => (
                  <article key={skill.title} className={styles.skillItem}>
                    <h3 className={styles.skillTitle}>{skill.title}</h3>
                    <p className={styles.skillDescription}>{skill.description}</p>
                  </article>
                ))}
              </div>

              <motion.div
                className={styles.skillsMedia}
                initial={
                  prefersReducedMotion
                    ? false
                    : { clipPath: "inset(14% 0% 0% 0% round 12px)", opacity: 0.6 }
                }
                whileInView={{ clipPath: "inset(0% 0% 0% 0% round 12px)", opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              >
                <motion.img
                  src="/images/about/craft-detail.webp"
                  alt={isVi ? "Sổ phác thảo giao diện và laptop" : "Wireframe sketchbook beside laptop"}
                  className={styles.photo}
                  loading="lazy"
                  decoding="async"
                  initial={prefersReducedMotion ? false : { scale: 1.08 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.1, ease: EASE_OUT }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* SCREEN 4: GITHUB ACTIVITY — Surface ground, equal edges */}
        <section className={styles.githubSection}>
          <div className={styles.wrap}>
            <div className={styles.sectionTopRow}>
              <h2 className={styles.sectionHeading}>{t.github.title}</h2>
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubLink}
              >
                <span>@{GITHUB_USERNAME}</span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className={styles.githubStack}>
              <GitHubStats username={GITHUB_USERNAME} data={stats} />
              <ContributionGraph
                username={GITHUB_USERNAME}
                data={contributions.contributions}
                totalContributions={contributions.totalContributions}
                error={contributions.error}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Closing Band — Curved Divider + CTA + Footer */}
      <div ref={closingBandRef} className={styles.closingBand}>
        <CurvedDivider
          topColor="var(--color-neutral-2)"
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

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <BackToTop />
    </div>
  );
}
