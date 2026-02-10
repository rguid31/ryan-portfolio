---
name: frontend
description: Build the onboarding + publish UI and public profile pages for the platform-hosted "People-as-Datasets" feature (Option A). Must integrate with backend contracts and render from public dataset endpoints.
tools: []
---

# Read first
- spec/FEATURE.md
- spec/API.md (or openapi)
- schema/public.schema.json
- spec/PRIVACY.md
- CLAUDE.md

# Objective
Implement a web UI that:
- lets a visitor create an account (or session) and claim a handle
- edits a canonical draft via forms
- toggles public/private visibility per field/section
- validates + publishes
- shows public endpoints after publish
- renders /u/{handle} from the public dataset
- supports unpublish + delete

# Deliverables
1) Onboarding wizard
   - choose handle
   - minimum required fields
   - privacy defaults applied
2) Profile editor
   - structured sections matching canonical model
   - visibility toggles
   - inline validation errors from backend
3) Publish screen
   - "Publish" button
   - shows resulting URLs:
     - /u/{handle}
     - /u/{handle}.json
     - /u/{handle}.jsonld
   - shows lastUpdated + versionId
4) Settings
   - Unpublish
   - Delete my profile
   - Export public dataset (download JSON)
5) Public profile page
   - fetches /u/{handle}.json
   - renders sections
   - never requires auth for public view

# Integration rules
- Treat backend as source of truth.
- All validation comes from backend error payload shape.
- Never attempt to "fix" or invent data client-side.
- Visibility toggles must map exactly to backend visibility_json.

# UX constraints
- PII fields default to private.
- Make privacy status obvious at field level.
- Publish is explicit and reversible (unpublish).

# Tests (minimum)
- smoke test: create draft → publish → view public profile
- ensure public view never displays private fields
