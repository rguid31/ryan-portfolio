# 🔍 Truth Engine: Platform Guide

Your site now includes the **Truth Engine**, a "People-as-Datasets" platform tailored for professionals.

## 🚀 Key Features

### 1. 🤖 AI Autofill
**Convert text to structured data instantly.**
- **How to use**: Click the **✨ Autofill** button in your dashboard.
- **Input**: Paste your Resume, LinkedIn Summary, or a personal website URL.
- **Engine**: Powered by Google Gemini (`gemini-flash-latest`), it intelligently extracts and cleans your data.
- **Fixes**: Automatically handles date formatting and URL validation.

### 2. 🛡️ Granular Privacy Control
**You own your data.**
- **Section Visibility**: Toggle entire sections (Skills, Projects) as *Public* or *Private*.
- **PII Safety**: Contact details (Phone/Email) are **Private by Default**.
- **Overrides**: Opt-in to share specific public emails while keeping your phone number hidden.

### 3. 🌐 Public Dataset Profile
**More than just a webpage.**
- **View**: `http://localhost:3000/u/[your-handle]`
- **API**: `http://localhost:3000/u/[your-handle]/json`
    - Developers and agents can consume your profile as a structured dataset.
- **SEO**: Automatic JSON-LD injection for better search visibility.

### 4. 📸 Immutable Snapshots
- Publishing creates a permanent, versioned snapshot of your data.
- Ensures that anyone linking to your dataset gets a consistent version.

### 5. 👥 User Management
- **Registration**: Open by default, but you can lock it down.
- **Config**: Set `ALLOW_REGISTRATION=false` in `.env.local` to secure your platform.

## 🛠️ Tech Stack
- **Database**: SQLite (via `better-sqlite3`).
- **Validation**: AJV (JSON Schema).
- **AI**: Google Generative AI SDK.
- **Auth**: Secure session-based authentication.
