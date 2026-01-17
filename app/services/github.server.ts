/**
 * GitHub API Service - Server-side only
 * Fetches contribution data using GitHub GraphQL API
 */

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubContributionsResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar;
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

export interface ContributionData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributions {
  totalContributions: number;
  contributions: ContributionData[];
  error?: string;
}

// In-memory cache for contributions (5 minutes TTL)
const CACHE_TTL = 5 * 60 * 1000;
const contributionsCache = new Map<string, { data: GitHubContributions; timestamp: number }>();

/**
 * Get contribution level based on count (GitHub's algorithm approximation)
 */
function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Fetch GitHub contributions using GraphQL API
 * This function should only be called from server-side code (loaders, actions)
 * Includes in-memory caching to avoid repeated API calls
 */
export async function fetchGitHubContributions(
  username: string
): Promise<GitHubContributions> {
  // Check cache first
  const cached = contributionsCache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      totalContributions: 0,
      contributions: [],
      error: "GITHUB_TOKEN not configured",
    };
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubContributionsResponse = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    if (!data.data.user) {
      throw new Error("User not found");
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    const contributions: ContributionData[] = [];

    // Flatten weeks into days
    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        });
      }
    }

    const result: GitHubContributions = {
      totalContributions: calendar.totalContributions,
      contributions,
    };

    // Store in cache
    contributionsCache.set(username, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return {
      totalContributions: 0,
      contributions: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// GitHub Stats API (User + Repos)
// ============================================

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface GitHubStatsData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  topLanguages: LanguageStat[];
  error?: string;
}

// Language colors mapping (GitHub's official colors)
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Shell: "#89e051",
  Dart: "#00B4AB",
};

const DEFAULT_COLOR = "#8b8b8b";

// Cache for GitHub stats
const statsCache = new Map<string, { data: GitHubStatsData; timestamp: number }>();

/**
 * Fetch GitHub user stats (profile + repos)
 * Server-side only with caching
 */
export async function fetchGitHubStats(username: string): Promise<GitHubStatsData> {
  // Check cache first
  const cached = statsCache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // Fetch user profile and repos in parallel
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
    ]);

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status}`);
    }
    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repos: ${reposResponse.status}`);
    }

    const user: GitHubUser = await userResponse.json();
    const repos: GitHubRepo[] = await reposResponse.json();

    // Calculate stats
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    // Calculate language statistics
    const languageCounts: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const totalReposWithLang = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const topLanguages: LanguageStat[] = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalReposWithLang) * 100),
        color: LANGUAGE_COLORS[name] || DEFAULT_COLOR,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 languages

    // Sort repos by stars (top 6)
    const topRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    const result: GitHubStatsData = {
      user,
      repos: topRepos,
      totalStars,
      totalForks,
      topLanguages,
    };

    // Store in cache
    statsCache.set(username, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return {
      user: null,
      repos: [],
      totalStars: 0,
      totalForks: 0,
      topLanguages: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
