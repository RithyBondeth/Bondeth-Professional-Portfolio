export interface NavLink {
  href: string;
  label: string;
}

export interface Skill {
  name: string;
  icon: string;
  color: string;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  live: string | null;
}

export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  bio: string[];
  email: string;
  github: string;
  linkedin: string;
}
