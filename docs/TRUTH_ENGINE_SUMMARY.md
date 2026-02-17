# Truth Engine: Project Progress & Architecture

**Date:** February 10, 2026
**Project:** Privacy-First "People-as-Datasets" Platform
**Status:** Alpha / Core Infrastructure Complete

## 1. Overview
Truth Engine is a decentralized-inspired professional profile platform. It treats personal data as a structured dataset, allowing users to maintain a "Single Source of Truth" (Canonical Profile) while selectively publishing specific fields to a "Public Snapshot."

---

## 2. Core Accomplishments

### 🏗️ Backend Infrastructure (The "Engine")
- **Cloud-Ready Persistence**: Implemented a flexible database layer using `@libsql/client` (Turso), supporting both local SQLite for development and cloud-hosted LibSQL for production.
- **Relational Schema**: 
    - `users`: Secure account management with `bcryptjs` hashing.
    - `handles`: Claimable unique identifiers (e.g., `@ryan`).
    - `profile_drafts`: Private workspace for canonical data.
    - `profile_snapshots`: Immutable, versioned records of published data.
    - `search_index`: Optimized table for global discovery.
    - `sessions`: Secure cookie-based authentication.
- **Privacy Engine**: Logic to transform a private "Canonical Profile" into a "Public Profile" based on field-level visibility settings (Public vs. Private).
- **JSON-LD Integration**: Automatic generation of Schema.org `Person` entities for SEO and AI/LLM readability.

### 🖥️ Dashboard & User Experience
- **Consolidated Dashboard**: Created a unified `DashboardLayout` with a sticky sub-navigation bar for seamless switching between Editor, Privacy, and Settings.
- **One-Click Vercel Deployment**: 
    - Built a "Truth Engine Viewer" template.
    - Integrated a `DeployCard` that pre-fills environment variables and provides a pre-deployment checklist.
    - Added a `template.json` to the viewer to guide Vercel users through configuration.
- **AI Autofill**: Implemented a "Paste Resume" feature that uses AI (Google Gemini) to map raw text onto the Truth Engine JSON schema.
- **Premium Aesthetics**: Upgraded the UI with modern gradients, glassmorphism effects, and custom animations (`animate-fadeIn`, `animate-slideUp`).

### 🛡️ Security & Reliability
- **Rate Limiting**: Added IP-based rate limiting to prevent auth abuse (10 req/min) and public read spam.
- **Safe Logging**: Created a `safe-logger` that redacts PII (Personally Identifiable Information) from server logs while still providing debug context.
- **C++ Native Module Removal**: Switched from `better-sqlite3` to `@libsql/client` to eliminate native module bundling issues in Serverless environments.

---

## 3. Data Architecture (Machine-Readable)

### Canonical Profile Schema
The platform centers around a strictly typed JSON object:
- `identity`: Name, Headline, Summary, Location, Image.
- `links`: Website, Social Profiles.
- `experience`: Organization, Title, Highlights, Tags, **Private Notes**.
- `projects`: Name, Description, Tech Stack, URLs.
- `contact`: Emails (typed), Phone Number.
- `PII`: Date of Birth, Address (Protected by default).

### Public API Endpoints
- `GET /api/u/[handle]/json`: Returns the latest public snapshot.
- `GET /api/u/[handle]/jsonld`: Returns Schema.org JSON-LD for the profile.
- `GET /api/query`: Global search endpoint across the public index.

---

## 4. Current State & Known Blockers
- **Auth Connectivity**: Some users reporting a "Network Error" during login/signup. This is likely due to the interaction between Vercel's serverless environment and the local SQLite file system.
- **Live Sync**: The viewer template is ready but requires manual verification of the environment variable handoff.

---

## 5. Next Steps
1.  **Resolve "Network Error"**: Shift from local SQLite to a cloud-native or serverless-compatible database (like Turso/libSQL or Supabase) if deploying to Vercel/Edge.
2.  **Handle Reservation**: Add logic to prevent handle squatting and allow "Verify-to-Claim" flows.
3.  **Global Search UI**: Build a "directory" page that allows users to find other Truth Engine profiles via the global index.
