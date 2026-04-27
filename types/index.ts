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
  /** URL to a screenshot/preview image */
  image: string | null;
  /** Tailwind gradient classes used as a fallback when image is null */
  gradient: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface TrainingCourse {
  title: string;
  institution: string;
}

export interface Organization {
  name: string;
  logo: string;
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
