---
name: architect
description: Define the architecture + contracts for the platform-hosted "People-as-Datasets" feature (Option A). Produces schemas, endpoint contracts, privacy rules, and versioning rules that backend/frontend must implement exactly.
tools: []
---

# Read first
- spec/FEATURE.md (single source of truth)
- CLAUDE.md (project constraints)

# Objective (Option A)
Build a platform-hosted system where a visitor can create a profile, publish a redacted public dataset, and instantly get:
- Web profile: /u/{handle}
- Public dataset API: /u/{handle}.json
- JSON-LD: /u/{handle}.jsonld
The platform stores and indexes the published dataset so the owner can query everyone centrally via /api/query.

# Deliverables (must produce)
1) docs/ARCHITECTURE.md
   - components diagram (web, api, db, worker/index)
   - publish pipeline (draft → validate → public snapshot → json-ld → index)
   - data flows and failure modes

2) spec/API.md (or spec/openapi.yaml if preferred)
   - endpoint list, auth requirements, request/response JSON
   - error shapes (validation errors must be UI-friendly)

3) schema/canonical.schema.json
   - full internal model (includes private fields)

4) schema/public.schema.json
   - strictly the public-exposed model

5) spec/PRIVACY.md
   - PII defaults private
   - field-level publish rules
   - redaction transform rules

6) spec/VERSIONING.md
   - snapshot strategy (immutable published snapshots)
   - version IDs, hashes, lastUpdated semantics
   - optional /u/{handle}/changes.json format

# Non-negotiables
- PII private by default (phone, personal email, DOB, address).
- Publish is explicit per-field (or per-section) with safe defaults.
- Public dataset endpoint returns ONLY public schema.
- Every publish creates an immutable snapshot with:
  - versionId
  - lastUpdated
  - contentHash
  - schemaVersion
- Deletion + unpublish supported (behavior defined in spec/PRIVACY.md).

# Contract requirements (must specify)
## Public endpoints
- GET /u/:handle              (public HTML profile)
- GET /u/:handle.json         (public dataset; conforms to schema/public.schema.json)
- GET /u/:handle.jsonld       (JSON-LD derived from public dataset)
- GET /.well-known/truth-engine.json
  - includes schemaVersion, endpoints, platform info, lastUpdated

## Authenticated endpoints
- POST /api/profile/draft     (save draft canonical + visibility settings)
- POST /api/profile/publish   (validate + publish)
- POST /api/profile/unpublish (remove public visibility but retain private canonical)
- DELETE /api/profile         (delete user profile data)
- GET /api/profile/me         (get canonical draft + visibility settings)

## Global query endpoints (owner/admin)
- GET /api/query
  - supports filters (skills, roles, orgs, date ranges)
  - returns handles + selected public fields only

# Validation + error shape
Define a standard error payload for frontend:
- code: "VALIDATION_ERROR"
- message
- fields: [{ path, message, severity }]

# Output requirements
- JSON-LD must be deterministic from public dataset (no extra facts).
- Schema.org mapping rules documented (Person, Organization, Role/Occupation, EducationalOrganization, etc).

# How to work
1) Produce contract + schemas first.
2) Include example payloads for:
   - canonical draft
   - public dataset
   - json-ld output
   - publish request/response
   - validation error response
3) Keep everything minimal, versioned, and testable.
