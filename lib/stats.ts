import { getMasterReport } from './masterReport';

/**
 * Calculate total number of projects
 */
export function getTotalProjects(): number {
    const data = getMasterReport();
    return data.projects.length;
}

/**
 * Calculate total number of featured projects
 */
export function getFeaturedProjectsCount(): number {
    const data = getMasterReport();
    return data.projects.filter((p) => p.featured).length;
}

/**
 * Calculate years of professional experience
 */
export function getYearsOfExperience(): number {
    const data = getMasterReport();

    if (!data.experience || data.experience.length === 0) {
        return 0;
    }

    // Find the earliest start date
    const startDates = data.experience
        .map((exp) => new Date(exp.startDate))
        .filter((date) => !isNaN(date.getTime()));

    if (startDates.length === 0) {
        return 0;
    }

    const earliestDate = new Date(Math.min(...startDates.map((d) => d.getTime())));
    const now = new Date();

    const years = now.getFullYear() - earliestDate.getFullYear();
    const monthDiff = now.getMonth() - earliestDate.getMonth();

    // Adjust if we haven't reached the anniversary month yet
    return monthDiff < 0 ? years - 1 : years;
}

/**
 * Calculate total number of skills across all categories
 */
export function getTotalSkills(): number {
    const data = getMasterReport();

    if (!data.skills) {
        return 0;
    }

    let total = 0;
    for (const category in data.skills) {
        if (data.skills[category]?.items) {
            total += data.skills[category].items.length;
        }
    }

    return total;
}

/**
 * Calculate education progress (credits completed / total credits)
 */
export function getEducationProgress(): { completed: number; total: number; percentage: number } {
    const data = getMasterReport();

    // Find the in-progress mathematics degree
    const mathDegree = data.education.find((edu) =>
        edu.field === 'Mathematics' && edu.degree.includes('Bachelor')
    );

    if (!mathDegree) {
        return { completed: 0, total: 0, percentage: 0 };
    }

    // Parse credits from description if available
    // Expected format: "88/120 credits complete" or similar
    const description = mathDegree.description || '';
    const creditsMatch = description.match(/(\d+)\/(\d+)\s+credits?/i);

    if (creditsMatch) {
        const completed = parseInt(creditsMatch[1], 10);
        const total = parseInt(creditsMatch[2], 10);
        const percentage = Math.round((completed / total) * 100);
        return { completed, total, percentage };
    }

    return { completed: 0, total: 0, percentage: 0 };
}

/**
 * Count active certifications
 */
export function getActiveCertifications(): number {
    const data = getMasterReport();

    if (!data.certifications) {
        return 0;
    }

    return data.certifications.filter((cert) =>
        cert.status === 'Active' || cert.status === 'In Progress'
    ).length;
}

/**
 * Get all portfolio stats in one call
 */
export function getPortfolioStats() {
    return {
        totalProjects: getTotalProjects(),
        featuredProjects: getFeaturedProjectsCount(),
        yearsExperience: getYearsOfExperience(),
        totalSkills: getTotalSkills(),
        educationProgress: getEducationProgress(),
        activeCertifications: getActiveCertifications(),
    };
}
