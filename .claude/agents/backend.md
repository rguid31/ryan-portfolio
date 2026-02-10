---
name: backend
description: Implement the platform API, storage, publish pipeline, JSON schema validation, JSON-LD generation, indexing, and global query endpoints for the platform-hosted "People-as-Datasets" feature (Option A).
tools: []
---

# Read first
- spec/FEATURE.md
- spec/API.md (or openapi)
- schema/canonical.schema.json
- schema/public.schema.json
- spec/PRIVACY.md
- spec/VERSIONING.md
- CLAUDE.md

# Objective
Implement a working backend that:
- stores canonical drafts (private)
- publishes a public snapshot (redacted) + JSON-LD
- exposes /u/{handle}.json and /u/{handle}.jsonld
- indexes public snapshots for /api/query
- supports unpublish + delete

# Deliverables (must produce)
1) API server implementation
2) Database schema + migrations
3) Publish pipeline implementation
4) JSON schema validation (canonical + public)
5) Public dataset + JSON-LD endpoints
6) Global query endpoint (/api/query) with filters
7) Tests:
   - schema validation tests
   - publish pipeline tests
   - public endpoint tests
   - query endpoint tests

# Minimum endpoint behaviors (must match spec)
## Public
- GET /u/:handle.json
  - returns latest published public snapshot
  - 404 if not published
- GET /u/:handle.jsonld
  - returns JSON-LD derived from latest published public snapshot
  - 404 if not published
- GET /.well-known/truth-engine.json

## Authenticated (user)
- POST /api/profile/draft
  - saves canonical draft + visibility config
  - returns draftId + validation state
- GET /api/profile/me
  - returns canonical draft + visibility
- POST /api/profile/publish
  - validates canonical draft
  - derives public dataset via privacy rules
  - validates public dataset against public schema
  - creates immutable snapshot (versionId, contentHash, lastUpdated)
  - generates/stores JSON-LD
  - updates indexes
- POST /api/profile/unpublish
  - removes public visibility for handle (public endpoints 404)
  - retains private canonical draft
- DELETE /api/profile
  - deletes profile + snapshots + indexes (hard delete)

## Admin/owner
- GET /api/query
  - returns only public fields
  - supports: skill filters, org filters, role filters, date filters

# Data storage (recommended minimum)
- users (id, auth fields)
- handles (user_id, handle, status)
- profile_drafts (user_id, canonical_json, visibility_json, updated_at)
- profile_snapshots (handle, version_id, public_json, jsonld_json, content_hash, created_at)
- search_index (handle, flattened fields for querying)

# Implementation rules
- Never expose canonical fields in public endpoints.
- Apply redaction exactly as spec/PRIVACY.md.
- Version IDs must be unique and stable per snapshot.
- contentHash should be derived from canonical serialization of public JSON.

# Test rules
- Add fixtures for canonical → public transformation
- Add tests that assert PII cannot leak (phone/email/DOB)
- Add tests for unpublish + delete behavior
