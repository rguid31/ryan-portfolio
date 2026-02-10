# Architecture: People-as-Datasets Platform

## Overview

This system extends the existing ryan-portfolio Next.js application with a
platform-hosted "People-as-Datasets" feature. Users can create profiles, manage
privacy settings, and publish structured public datasets accessible via API.

## Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 App                       │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Portfolio    │  │  Platform    │  │  Public      │  │
│  │  Pages       │  │  UI (Auth)   │  │  Profile     │  │
│  │  /, /about,  │  │  /dashboard  │  │  /u/:handle  │  │
│  │  /projects.. │  │  /editor     │  │              │  │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘  │
│                           │                  │          │
│  ┌────────────────────────┴──────────────────┴───────┐  │
│  │              Next.js API Routes                   │  │
│  │                                                   │  │
│  │  /api/profile/draft    (POST - auth)              │  │
│  │  /api/profile/publish  (POST - auth)              │  │
│  │  /api/profile/unpublish(POST - auth)              │  │
│  │  /api/profile/me       (GET  - auth)              │  │
│  │  /api/profile          (DELETE - auth)            │  │
│  │  /api/query            (GET  - public)            │  │
│  │                                                   │  │
│  │  /u/:handle.json       (GET  - public)            │  │
│  │  /u/:handle.jsonld     (GET  - public)            │  │
│  │  /.well-known/truth-engine.json (GET - public)    │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                              │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │              Core Library (lib/)                  │  │
│  │                                                   │  │
│  │  lib/truth-engine/                                │  │
│  │  ├── schema-validator.ts  (AJV validation)        │  │
│  │  ├── privacy-engine.ts    (canonical → public)    │  │
│  │  ├── jsonld-generator.ts  (public → JSON-LD)      │  │
│  │  ├── snapshot.ts          (versioning + hashing)   │  │
│  │  ├── storage.ts           (SQLite via better-sql3) │  │
│  │  └── query.ts             (search/filter)         │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                              │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │              SQLite Database                      │  │
│  │              (data/truth-engine.db)               │  │
│  │                                                   │  │
│  │  Tables:                                          │  │
│  │  - users (id, email, password_hash, created_at)   │  │
│  │  - handles (user_id, handle, status)              │  │
│  │  - profile_drafts (user_id, canonical, visibility)│  │
│  │  - profile_snapshots (handle, version_id, public, │  │
│  │      jsonld, content_hash, created_at)            │  │
│  │  - search_index (handle, name, headline, skills,  │  │
│  │      location, updated_at)                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### Publish Pipeline
```
User edits draft in editor UI
        │
        ▼
POST /api/profile/draft
  → Validate canonical JSON against canonical.schema.json
  → Store draft + visibility settings in profile_drafts
  → Return validation result
        │
        ▼
POST /api/profile/publish
  → Load draft from profile_drafts
  → Validate canonical against canonical.schema.json
  → Apply privacy rules (spec/PRIVACY.md):
      - Remove sections where visibility = "private"
      - Redact hard-private PII (dateOfBirth, address, privateNotes)
      - Filter emails to only type="public"
      - Apply overrides
  → Validate derived public JSON against public.schema.json
  → Compute:
      - versionId (UUIDv4)
      - contentHash (SHA-256 of canonicalized public JSON)
      - publishedAt (ISO-8601)
  → Generate JSON-LD from public JSON (Schema.org Person mapping)
  → Store immutable snapshot in profile_snapshots
  → Update search_index with flattened public fields
  → Return publish confirmation with URLs
```

### Public Read Flow
```
GET /u/:handle.json
  → Lookup latest snapshot for handle where status = "published"
  → Return public_json (or 404)

GET /u/:handle.jsonld
  → Lookup latest snapshot for handle
  → Return jsonld_json (or 404)

GET /u/:handle
  → SSR page that fetches /u/:handle.json internally
  → Render profile from public dataset
```

## Technology Choices (MVP)

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Next.js 16 (existing) | Already deployed, SSR + API routes |
| Database | SQLite (better-sqlite3) | Zero infrastructure, file-based, fast for MVP |
| Schema Validation | AJV | Industry standard JSON Schema validator |
| Auth (MVP) | Simple session tokens | Cookie-based, no external dependency |
| JSON-LD | Manual mapping | Small surface area, Schema.org Person |
| Hashing | Node crypto (SHA-256) | Built-in, no dependency |
| UUID | Node crypto.randomUUID() | Built-in since Node 19 |

## File Structure (new files)
```
lib/truth-engine/
├── db.ts                   # SQLite connection + migrations
├── schema-validator.ts     # AJV validation against both schemas
├── privacy-engine.ts       # canonical → public transformation
├── jsonld-generator.ts     # public → JSON-LD (Schema.org)
├── snapshot.ts             # versioning, hashing, UUID
├── storage.ts              # CRUD for drafts, snapshots, index
├── query.ts                # search/filter for /api/query
├── auth.ts                 # simple session auth (MVP)
└── types.ts                # TypeScript types for truth-engine

app/api/truth-engine/
├── profile/
│   ├── draft/route.ts      # POST /api/profile/draft
│   ├── publish/route.ts    # POST /api/profile/publish
│   ├── unpublish/route.ts  # POST /api/profile/unpublish
│   ├── me/route.ts         # GET /api/profile/me
│   └── route.ts            # DELETE /api/profile
├── query/route.ts          # GET /api/query
└── well-known/route.ts     # GET /.well-known/truth-engine.json

app/u/[handle]/
├── page.tsx                # Public profile page (HTML)
├── json/route.ts           # GET /u/:handle.json
└── jsonld/route.ts         # GET /u/:handle.jsonld

app/dashboard/
├── page.tsx                # Profile editor + publish UI
└── settings/page.tsx       # Unpublish, delete, export

spec/                       # Already exists
├── canonical.schema.json
├── public.schema.json
├── API.md
├── FEATURE.md
├── PRIVACY.md
└── VERSIONING.md

data/                       # gitignored
└── truth-engine.db         # SQLite database file

__tests__/truth-engine/
├── schema-validator.test.ts
├── privacy-engine.test.ts
├── snapshot.test.ts
├── publish-pipeline.test.ts
└── api-endpoints.test.ts
```

## Security Model (MVP)
- Authentication: simple email + password with bcrypt, session cookie
- Authorization: users can only read/write their own profile
- Public endpoints: no auth required, read-only
- PII: never exposed in public endpoints (enforced by privacy engine)
- Rate limiting: basic per-IP for MVP

## Schema.org JSON-LD Mapping
```
public.identity     → schema:Person (name, description, image, address)
public.links        → schema:Person.url, schema:Person.sameAs
public.experience   → schema:Person.hasOccupation (schema:Role)
public.education    → schema:Person.alumniOf (schema:EducationalOrganization)
public.skills       → schema:Person.knowsAbout
public.projects     → schema:Person.owns (schema:CreativeWork)
public.contact      → schema:Person.email
```
