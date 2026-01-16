import { useMemo } from "react";
import { useLanguage } from "~/contexts/language";
import styles from "./contribution-graph.module.css";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGraphProps {
  username: string;
  data: ContributionDay[];
  totalContributions: number;
  error?: string;
}

// Get month labels for the graph
function getMonthLabels(): string[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  const result: string[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    result.push(months[date.getMonth()]);
  }
  
  return result;
}

/**
 * Format date for screen readers
 */
function formatDateForSR(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
}

/**
 * GitHub-style contribution graph component
 * Accessible with keyboard navigation and screen reader support
 */
export function ContributionGraph({ username, data, totalContributions, error }: ContributionGraphProps) {
  const { t } = useLanguage();
  
  const days = data;
  const total = totalContributions;

  const monthLabels = useMemo(() => getMonthLabels(), []);

  // Group days into weeks (columns)
  const weeks = useMemo(() => {
    if (days.length === 0) return [];
    
    const result: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];
    
    // Find the first Sunday to align the grid
    const firstDate = new Date(days[0].date);
    const firstDayOfWeek = firstDate.getDay();
    
    // Add empty cells for alignment
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: "", count: -1, level: 0 });
    }
    
    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add remaining days
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    
    return result;
  }, [days]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Empty state khi không có data
  if (days.length === 0) {
    return (
      <div className={styles.container} role="region" aria-label={t.github?.contributionGraph || "Contribution graph"}>
        <div className={styles.emptyState} role="status">
          {error ? (
            <span className={styles.errorText} role="alert">{error}</span>
          ) : (
            <span>{t.github?.noContributions || "No contribution data available"}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={styles.container} 
      role="region" 
      aria-label={t.github?.contributionGraph || "GitHub contribution graph"}
    >
      <div className={styles.header}>
        <span className={styles.totalText} aria-live="polite">
          {total.toLocaleString()} {t.github?.contributions || "contributions in the last year"}
        </span>
      </div>
      
      <div className={styles.graphWrapper}>
        {/* Day labels - hidden from screen readers as they're decorative */}
        <div className={styles.dayLabels} aria-hidden="true">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
            <span key={i} className={styles.dayLabel}>{label}</span>
          ))}
        </div>
        
        <div className={styles.graphContainer}>
          {/* Month labels */}
          <div className={styles.monthLabels} aria-hidden="true">
            {monthLabels.map((month, i) => (
              <span key={i} className={styles.monthLabel}>{month}</span>
            ))}
          </div>
          
          {/* Contribution grid - accessible table structure */}
          <div 
            className={styles.graph} 
            role="grid" 
            aria-label={t.github?.contributionGrid || "Contribution activity grid"}
          >
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week} role="row">
                {week.map((day, dayIndex) => {
                  const isValidDay = day.count >= 0;
                  const ariaLabel = isValidDay 
                    ? `${formatDateForSR(day.date)}: ${day.count} ${day.count === 1 ? "contribution" : "contributions"}`
                    : undefined;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`${styles.day} ${isValidDay ? styles[`level${day.level}`] : styles.empty}`}
                      role={isValidDay ? "gridcell" : "presentation"}
                      aria-label={ariaLabel}
                      tabIndex={isValidDay ? 0 : -1}
                      title={isValidDay ? `${day.date}: ${day.count} contributions` : undefined}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend with accessible labels */}
      <div className={styles.legend} role="group" aria-label={t.github?.legendLabel || "Contribution levels"}>
        <span className={styles.legendText}>{t.github?.less || "Less"}</span>
        <div className={`${styles.day} ${styles.level0}`} role="img" aria-label="0 contributions" />
        <div className={`${styles.day} ${styles.level1}`} role="img" aria-label="1-3 contributions" />
        <div className={`${styles.day} ${styles.level2}`} role="img" aria-label="4-6 contributions" />
        <div className={`${styles.day} ${styles.level3}`} role="img" aria-label="7-9 contributions" />
        <div className={`${styles.day} ${styles.level4}`} role="img" aria-label="10+ contributions" />
        <span className={styles.legendText}>{t.github?.more || "More"}</span>
      </div>
    </div>
  );
}
