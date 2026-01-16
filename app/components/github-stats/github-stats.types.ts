/**
 * GitHub user profile data from API
 */
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

/**
 * GitHub repository data
 */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

/**
 * Aggregated GitHub statistics
 */
export interface GitHubStatsData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  topLanguages: LanguageStat[];
  error?: string;
}

/**
 * Language usage statistics
 */
export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

/**
 * Props for GitHubStats component
 */
export interface GitHubStatsProps {
  username: string;
  className?: string;
  data?: GitHubStatsData;
}
