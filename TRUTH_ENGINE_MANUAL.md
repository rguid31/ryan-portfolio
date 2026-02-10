# Truth Engine: Technical Manual & Reference

This document provides a comprehensive overview of the Truth Engine architecture. It is designed to be readable by both humans and LLMs to ensure project continuity.

## 🏁 CORE PHILOSOPHY
Truth Engine treats a person's life as a **Structured Dataset**. 
- **Canonical**: The private, full version of your data.
- **Snapshot**: A point-in-time, privacy-filtered version of that data.
- **Visibility**: Field-by-field control using JSON Pointers (e.g. `/contact/emails`).

---

## 🏗️ SYSTEM ARCHITECTURE

### 1. Data Layer (`lib/truth-engine/storage.ts`)
- **Engine**: SQLite (via `better-sqlite3`).
- **Models**: Defined in `types.ts` using strict TypeScript interfaces.
- **Versioning**: Every "Publish" creates a new `ProfileSnapshot` with a unique UUID.

### 2. Privacy Engine (`lib/truth-engine/privacy-engine.ts`)
- **Logic**: Filters the Canonical Profile based on `VisibilitySettings`.
- **Redaction**: Automatically redacts PII (Date of Birth, private notes) regardless of settings to prevent accidental exposure.

### 3. SEO & AI Readiness (`lib/truth-engine/jsonld-generator.ts`)
- **Format**: JSON-LD (Schema.org/Person).
- **Benefit**: Makes your profile perfectly readable by Google Search and AI Agents.

---

## 🛤️ DASHBOARD NAVIGATION
The dashboard is split into three primary views, managed via `app/dashboard/layout.tsx`:
1.  **Editor** (`/dashboard`): Edit your structured profile data.
2.  **Privacy** (`/dashboard/privacy`): Field-level toggles and PII warnings.
3.  **Settings** (`/dashboard/settings`): Account deletion, unpublishing, and data export.

---

## 🚀 DEPLOYMENT & SYNC
- **The Viewer**: A separate template (residing in `truth-engine-viewer/`) that "mirrors" your platform data.
- **One-Click Deploy**: The dashboard generates a Vercel Clone URL that pre-configures your `HANDLE` and `API_URL`.

---

## 🛠️ CURRENT BLOCKER: "NETWORK ERROR"
- **Cause**: SQLite is a local file. Vercel is "Serverless." Serverless functions cannot save files to disk.
- **Symptom**: `better-sqlite3` fails to open the database on the live Vercel site.
- **Solution**: Switch to **Turso** (LibSQL).

---

## 📝 HANDOVER CHECKLIST for Next Steps
- [ ] Sign up for [Turso](https://turso.tech) (Free).
- [ ] Create a database named `truth-engine`.
- [ ] Get the `LIBSQL_URL` and `LIBSQL_AUTH_TOKEN`.
- [ ] Add these to your Vercel Environment Variables.
- [x] Update `lib/truth-engine/db.ts` to use `@libsql/client` instead of `better-sqlite3`.
