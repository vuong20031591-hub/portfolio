import type { ReactNode } from "react";

/**
 * Types cho SkillsSection component
 */

export interface SkillTag {
  name: string;
  icon: ReactNode;
}

export interface SkillItem {
  icon: ReactNode;
  title: string;
  description: string;
  tags: SkillTag[];
  className: string;
}

export interface SkillsSectionProps {
  className?: string;
}
