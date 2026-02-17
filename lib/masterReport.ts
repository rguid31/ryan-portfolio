import { promises as fs } from 'fs';
import path from 'path';
import { cache } from 'react';
import { MasterReport } from './types';
import 'server-only';

// Use React cache to deduplicate requests for the same file in a single render pass
export const getMasterReport = cache(async (): Promise<MasterReport> => {
  const filePath = path.join(process.cwd(), 'public/data/master_report.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
});

export async function getProjects() {
  const data = await getMasterReport();
  return data.projects;
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getFeaturedProjects() {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}

export async function getExperience() {
  const data = await getMasterReport();
  return data.experience;
}

export async function getCurrentExperience() {
  const experience = await getExperience();
  return experience.filter((exp) => exp.current);
}

export async function getEducation() {
  const data = await getMasterReport();
  return data.education;
}

export async function getSkills() {
  const data = await getMasterReport();
  return data.skills;
}

export async function getPersonalInfo() {
  const data = await getMasterReport();
  return data.personal;
}

export async function getSummary() {
  const data = await getMasterReport();
  return data.summary;
}

export async function getHobbies() {
  const data = await getMasterReport();
  return data.hobbies;
}

export async function getCertifications() {
  const data = await getMasterReport();
  return data.certifications;
}
