import { getMasterReport } from './masterReport';
import 'server-only';

/**
 * Calculate total number of projects
 */
export async function getTotalProjects(): Promise<number> {
    const data = await getMasterReport();
    return data.projects.length;
}

/**
 * Calculate total number of featured projects
 */
export async function getFeaturedProjectsCount(): Promise<number> {
    const data = await getMasterReport();
    return data.projects.filter((p) => p.featured).length;
}

/**
 * Calculate years of professional experience
 */
export async function getYearsOfExperience(): Promise<number> {
    const data = await getMasterReport();

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
export async function getTotalSkills(): Promise<number> {
    const data = await getMasterReport();

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
export async function getEducationProgress(): Promise<{ completed: number; total: number; percentage: number }> {
    const data = await getMasterReport();

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
export async function getActiveCertifications(): Promise<number> {
    const data = await getMasterReport();

    if (!data.certifications) {
        return 0;
    }

    return data.certifications.filter((cert) =>
        cert.status === 'Active' || cert.status === 'In Progress'
    ).length;
}

/**
 * Calculate exploration metrics for the dashboard
 */
export async function getExplorationMetrics() {
    const data = await getMasterReport();

    // Calculate project categories
    const projectCategories: Record<string, number> = {};
    data.projects.forEach(p => {
        projectCategories[p.category] = (projectCategories[p.category] || 0) + 1;
    });

    // Calculate skill categories
    const skillCategories: Record<string, number> = {};
    if (data.skills) {
        Object.keys(data.skills).forEach(cat => {
            skillCategories[cat] = data.skills[cat].items.length;
        });
    }

    // Need to await synchronous helpers if we were calling them, but we are calling getMasterReport directly
    // which is async now.

    const totalSkills = await getTotalSkills();
    const yearsExperience = await getYearsOfExperience();
    const activeCertifications = await getActiveCertifications();
    const educationProgress = await getEducationProgress();


    return {
        projects: {
            total: data.projects.length,
            byCategory: projectCategories,
            featured: data.projects.filter(p => p.featured).length
        },
        skills: {
            total: totalSkills,
            byCategory: skillCategories
        },
        experience: {
            totalYears: yearsExperience,
            companies: new Set(data.experience.map(e => e.company)).size,
            roles: data.experience.length
        },
        knowledge: {
            certifications: data.certifications?.length || 0,
            activeCertifications: activeCertifications,
            educationCredits: educationProgress
        }
    };
}

/**
 * Get all portfolio stats in one call
 */
export async function getPortfolioStats() {
    // Parallelize fetches where possible
    const [
        totalProjects,
        featuredProjects,
        yearsExperience,
        totalSkills,
        educationProgress,
        activeCertifications,
        exploration
    ] = await Promise.all([
        getTotalProjects(),
        getFeaturedProjectsCount(),
        getYearsOfExperience(),
        getTotalSkills(),
        getEducationProgress(),
        getActiveCertifications(),
        getExplorationMetrics()
    ]);

    return {
        totalProjects,
        featuredProjects,
        yearsExperience,
        totalSkills,
        educationProgress,
        activeCertifications,
        exploration
    };
}
