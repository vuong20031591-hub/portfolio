import { getLanguageColor } from "~/hooks/use-github-stats";
import { useLanguage } from "~/contexts/language";
import type { GitHubStatsProps } from "./github-stats.types";
import styles from "./github-stats.module.css";
import { Github, Star, GitFork, Users, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button/button";

/**
 * GitHub Stats component
 * Displays GitHub profile statistics including repos, stars, followers, and top languages
 * Receives data from server-side loader for optimal performance and CORS avoidance
 */
export function GitHubStats({ username, className, data }: GitHubStatsProps) {
  const { t } = useLanguage();

  // Use data from props (server-side)
  const user = data?.user;
  const repos = data?.repos || [];
  const totalStars = data?.totalStars || 0;
  const totalForks = data?.totalForks || 0;
  const topLanguages = data?.topLanguages || [];
  const error = data?.error;
  const isLoading = !data; // If no data provided, show loading

  if (isLoading) {
    return (
      <div className={`${styles.container} ${className || ""}`}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonHeader} />
          <div className={styles.skeletonStats} />
          <div className={styles.skeletonLanguages} />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`${styles.container} ${className || ""}`}>
        <div className={styles.error}>
          <Github className={styles.errorIcon} />
          <p>{t.github?.error || "Failed to load GitHub stats"}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: <BookOpen size={18} />, value: user.public_repos, label: t.github?.repos || "Repos" },
    { icon: <Star size={18} />, value: totalStars, label: t.github?.stars || "Stars" },
    { icon: <GitFork size={18} />, value: totalForks, label: t.github?.forks || "Forks" },
    { icon: <Users size={18} />, value: user.followers, label: t.github?.followers || "Followers" },
  ];

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <img src={user.avatar_url} alt={user.name || user.login} className={styles.avatar} />
          <div className={styles.profileInfo}>
            <h3 className={styles.name}>{user.name || user.login}</h3>
            <span className={styles.username}>@{user.login}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer">
            <Github size={16} />
            <span>{t.github?.viewProfile || "Profile"}</span>
            <ExternalLink size={14} />
          </a>
        </Button>
      </div>

      <div className={styles.statsGrid} role="list" aria-label={t.github?.statsLabel || "GitHub statistics"}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard} role="listitem">
            <div className={styles.statIcon} aria-hidden="true">{stat.icon}</div>
            <div className={styles.statValue}>{stat.value.toLocaleString()}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {topLanguages.length > 0 && (
        <div className={styles.languages}>
          <h4 className={styles.languagesTitle}>{t.github?.topLanguages || "Top Languages"}</h4>
          <div 
            className={styles.languageBar} 
            role="img" 
            aria-label={`Language distribution: ${topLanguages.map(l => `${l.name} ${l.percentage}%`).join(", ")}`}
          >
            {topLanguages.map((lang) => (
              <div
                key={lang.name}
                className={styles.languageSegment}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className={styles.languageList} role="list">
            {topLanguages.map((lang) => (
              <div key={lang.name} className={styles.languageItem} role="listitem">
                <span className={styles.languageDot} style={{ backgroundColor: lang.color }} aria-hidden="true" />
                <span className={styles.languageName}>{lang.name}</span>
                <span className={styles.languagePercent}>{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className={styles.repos}>
          <h4 className={styles.reposTitle}>{t.github?.topRepos || "Top Repositories"}</h4>
          <div className={styles.reposGrid}>
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoCard}
              >
                <div className={styles.repoHeader}>
                  <BookOpen size={16} className={styles.repoIcon} />
                  <span className={styles.repoName}>{repo.name}</span>
                </div>
                {repo.description && (
                  <p className={styles.repoDescription}>{repo.description}</p>
                )}
                <div className={styles.repoMeta}>
                  {repo.language && (
                    <span className={styles.repoLang}>
                      <span
                        className={styles.langDot}
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className={styles.repoStat}>
                    <Star size={14} />
                    {repo.stargazers_count}
                  </span>
                  <span className={styles.repoStat}>
                    <GitFork size={14} />
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
