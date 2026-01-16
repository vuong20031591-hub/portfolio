/**
 * Language color mapping helper
 * Maps programming language names to their official GitHub colors
 */
export function getLanguageColor(language: string): string {
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
  return LANGUAGE_COLORS[language] || DEFAULT_COLOR;
}
