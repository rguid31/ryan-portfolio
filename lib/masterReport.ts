import fs from 'fs';
import path from 'path';
import { MasterReport } from './types';

export function getMasterReport(): MasterReport {
  const filePath = path.join(process.cwd(), 'public/data/master_report.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getProjects() {
  const data = getMasterReport();
  return data.projects;
}

export function getProjectBySlug(slug: string) {
  const projects = getProjects();
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects() {
  const projects = getProjects();
  return projects.filter((project) => project.featured);
}

export function getExperience() {
  const data = getMasterReport();
  return data.experience;
}

export function getCurrentExperience() {
  const experience = getExperience();
  return experience.filter((exp) => exp.current);
}

export function getEducation() {
  const data = getMasterReport();
  return data.education;
}

export function getSkills() {
  const data = getMasterReport();
  return data.skills;
}

export function getPersonalInfo() {
  const data = getMasterReport();
  return data.personal;
}

export function getSummary() {
  const data = getMasterReport();
  return data.summary;
}
