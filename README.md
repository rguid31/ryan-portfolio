# 🌐 Ryan Guidry — Digital Twin Portfolio

> **A self-documenting, data-driven professional platform built on Next.js 16 and React 19.**

Welcome to my portfolio! This isn't just another static website—it's a **Digital Twin** architecture where a single JSON file serves as the "source of truth" for my entire professional identity.

[![Live Site](https://img.shields.io/badge/Live-ryanguidry.com-blue?style=for-the-badge)](https://ryanguidry.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 🎯 What Makes This Different?

Most portfolios are static HTML pages that require manual updates across multiple files. This portfolio uses a **"Digital Twin"** pattern:

- **One JSON file** (`public/data/master_report.json`) contains ALL professional data
- **Typed data layer** ensures type safety across the entire application
- **Static generation** creates blazing-fast pages at build time
- **Zero client-side JS** for content pages (thanks to React Server Components)
- **100/100 Lighthouse score** on all pages

### The Digital Twin Concept

Think of `master_report.json` as a **machine-readable resume**. It contains:
- 📋 Personal information & contact details
- 💼 Work experience & responsibilities
- 🎓 Education & coursework
- 🚀 Projects with detailed breakdowns
- 🛠️ Skills & tech stack
- 🎨 Hobbies & interests
- 📜 Certifications & volunteer work

This single file powers:
- The entire website UI
- Downloadable resume generation
- API endpoints for programmatic access
- Future AI agent integrations

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│   master_report.json (Digital Twin)     │
│   Single Source of Truth                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   lib/masterReport.ts                    │
│   Typed Data Access Layer                │
│   • getProjects()                        │
│   • getExperience()                      │
│   • getEducation()                       │
│   • getSkills()                          │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   Next.js App Router (React 19)          │
│   • /projects/[slug] - Dynamic routes    │
│   • /experience - Work history           │
│   • /education - Academic background     │
│   • /skills - Technical capabilities     │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   Static HTML (Build Time)               │
│   100% Pre-rendered, SEO-optimized       │
└──────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (I use 20.x)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/rguid31/ryan-portfolio.git
cd ryan-portfolio

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site locally.

### Build for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm start
```

---

## 📂 Project Structure

```
ryan-portfolio/
├── app/                      # Next.js App Router pages
│   ├── projects/[slug]/      # Dynamic project detail pages
│   ├── experience/           # Work experience page
│   ├── education/            # Education & coursework
│   ├── skills/               # Technical skills showcase
│   └── hobbies/              # Personal interests
├── components/               # Reusable React components
│   ├── ProjectCard.tsx       # Project preview cards
│   ├── ExperienceCard.tsx    # Work experience cards
│   └── SkillCategory.tsx     # Skill grouping component
├── lib/                      # Core utilities & data layer
│   ├── masterReport.ts       # Data access functions
│   └── types.ts              # TypeScript interfaces
├── public/
│   ├── data/
│   │   └── master_report.json  # 🌟 THE DIGITAL TWIN
│   └── images/               # Project screenshots, hobby assets
└── README.md                 # You are here!
```

---

## 🎨 Key Features

### 1. **Formative Project Showcase**
Each project page is structured to communicate technical depth quickly:
- **Problem & Purpose** — Why this project exists
- **Conceptual Architecture** — High-level system design
- **Technical Rigor** — Implementation details & responsibilities
- **Scale & Impact** — Metrics & measurable outcomes
- **Evolutionary Roadmap** — Future enhancements

### 2. **Categorized Coursework**
Interactive dropdowns for academic coursework, organized by discipline:
- Mathematics (Calculus, Linear Algebra, Differential Equations)
- Chemical Engineering (Thermodynamics, Fluid Mechanics, Process Control)
- Computer Science (Data Structures, Algorithms)

### 3. **Type-Safe Data Layer**
Every piece of data is strongly typed with TypeScript interfaces:
```typescript
interface Project {
  id: string;
  projectName: string;
  slug: string;
  category: string;
  narrative?: string;
  conceptualArchitecture?: string;
  techStack: string[];
  impactMetrics?: Record<string, string>;
  roadmap?: string[];
}
```

### 4. **Static Site Generation (SSG)**
All pages are pre-rendered at build time using `generateStaticParams`:
- ⚡ Instant page loads
- 🔍 Perfect SEO
- 📱 Works offline (after first visit)

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16.1.6, React 19.2.3 |
| **Language** | TypeScript 5+ (Strict Mode) |
| **Styling** | Tailwind CSS 4, CSS3 |
| **Performance** | React Compiler, Server Components |
| **Deployment** | Vercel (CI/CD, Edge Network) |
| **Version Control** | Git, GitHub |

---

## 📝 How to Update Content

### Adding a New Project

1. Open `public/data/master_report.json`
2. Add a new entry to the `projects` array:
```json
{
  "id": "my-new-project",
  "projectName": "My New Project",
  "slug": "my-new-project",
  "category": "Web Development",
  "status": "Active",
  "featured": true,
  "order": 10,
  "projectDescription": "A brief overview...",
  "shortDescription": "One-liner description",
  "narrative": "The story behind this project...",
  "conceptualArchitecture": "How the system is designed...",
  "techStack": ["React", "Node.js", "PostgreSQL"],
  "impactMetrics": {
    "users": "1000+ active users",
    "performance": "< 100ms response time"
  },
  "roadmap": ["Feature A", "Feature B"]
}
```
3. Run `npm run build` to generate the new static page
4. The project will automatically appear on `/projects` and have its own detail page at `/projects/my-new-project`

### Updating Work Experience

Edit the `experience` array in `master_report.json`:
```json
{
  "id": "my-company",
  "company": "My Company",
  "position": "Software Engineer",
  "startDate": "2024-01",
  "endDate": null,
  "current": true,
  "description": "What I do here...",
  "responsibilities": [
    "Built feature X",
    "Optimized system Y"
  ]
}
```

---

## 🌟 Highlights

- **100/100 Lighthouse Score** — Perfect performance, accessibility, SEO, and best practices
- **15% Bundle Size Reduction** — Thanks to React Compiler's automatic memoization
- **< 60 Second Build Time** — Fast CI/CD pipeline on Vercel
- **100% TypeScript Coverage** — Full type safety across the entire codebase
- **Zero-Config Updates** — Edit JSON, rebuild, deploy. That's it.

---

## 🚢 Deployment

This site is deployed on **Vercel** with automatic CI/CD:

1. Push changes to `main` branch
2. Vercel automatically builds and deploys
3. Live in ~60 seconds

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rguid31/ryan-portfolio)

---

## 🤝 Contributing

This is a personal portfolio, but if you find a bug or have a suggestion:

1. Open an issue describing the problem
2. Or submit a pull request with a fix

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💬 Contact

**Ryan Guidry**  
📧 [inquireryan@gmail.com](mailto:inquireryan@gmail.com)  
🌐 [ryanguidry.com](https://ryanguidry.com)  
💼 [LinkedIn](https://linkedin.com/in/rmguidry)  
🐙 [GitHub](https://github.com/rguid31)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)
- Inspired by the concept of "Digital Twins" in IoT and data engineering

---

**⭐ If you find this architecture interesting, consider giving it a star!**
