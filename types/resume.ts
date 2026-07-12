export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  bullets: string[];
  techStack: string[];
  link?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  startDate: string; // ISO
  endDate: string | null; // null = present
  bullets: string[];
  techStack: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface ResumeContent {
  summary: string;
  skills: string[];
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
}
