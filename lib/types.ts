export interface MasterReport {
  metadata: Metadata;
  personal: Personal;
  summary: Summary;
  projects: Project[];
  education: Education[];
  experience: Experience[];
  skills: Skills;
  certifications: Certification[];
  volunteer: Volunteer[];
  insightsProfile: InsightsProfile;
  hobbies: Hobby[];
}

export interface Hobby {
  id: string;
  name: string;
  description: string;
  category: string;
  url?: string;
  image?: string;
  featured?: boolean;
}

export interface Metadata {
  version: string;
  lastUpdated: string;
  completeness: number;
  purpose: string;
  schemaVersion: string;
}

export interface Personal {
  fullName: string;
  firstName: string;
  lastName: string;
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  social: {
    linkedin: string;
    github: string;
    twitter: string;
  };
  availability: {
    status: string;
    preferredRoles: string[];
    workPreferences: string[];
    startDate: string;
  };
}

export interface Summary {
  headline: string;
  tagline: string;
  description: string;
  coreCompetencies: string[];
  valueProposition: string;
}

export interface Project {
  id: string;
  projectName: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  order: number;
  projectDescription: string;
  shortDescription: string;
  myRole: string;
  responsibilities: string[];
  techStack: string[];
  techCategories: {
    [key: string]: string[];
  };
  challengesFaced: Challenge[];
  keyLearnings: string[];
  impactMetrics: {
    [key: string]: string;
  };
  developmentTimeline: {
    [key: string]: string;
  };
  targetAudience: string;
  projectURL: string | null;
  repoURL: string;
  images: string[];
  narrative?: string;
  conceptualArchitecture?: string;
  roadmap?: string[];
}

export interface Challenge {
  challenge: string;
  description: string;
  solution: string;
  result: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  skills: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: {
    city: string;
    state: string;
  };
  graduationDate: string;
  dateLabel?: string;
  gpa?: number;
  relevantCoursework: string[];
  categorizedCoursework?: {
    [category: string]: string[];
  };
  achievements: string[];
  description?: string;
}

export interface Skills {
  [category: string]: {
    category: string;
    items: SkillItem[];
  };
}

export interface SkillItem {
  name: string;
  level: string;
  yearsOfExperience?: number;
  context?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: string;
  startDate?: string | null;
  completionDate?: string | null;
  issueDate?: string | null;
  expirationDate?: string | null;
  credentialID?: string | null;
  credentialURL?: string | null;
  credentialType?: string;
  skills: string[];
}

export interface Volunteer {
  id: string;
  role: string;
  organization: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
}

export interface InsightsProfile {
  profileType: string;
  energies: {
    coolBlue: number;
    fieryRed: number;
    sunshineYellow: number;
    earthGreen: number;
  };
  strengths: string[];
  communicationStyle: {
    prefers: string;
    values: string;
    approach: string;
  };
  workPreferences: {
    idealEnvironment: string;
    motivation: string;
    decisionMaking: string;
  };
}
