You are building "One-click People-as-Datasets".

Workstyle
- Always start by reading spec/FEATURE.md.
- Produce a plan, then implement in small PR-like steps.
- Add tests for schema validation + API endpoints.
- Keep secrets out of the repo. Use env vars.

Architecture constraints
- Data model: normalized canonical JSON + versioned snapshots.
- Output model: JSON-LD (Schema.org Person etc.) derived from canonical JSON via transformer functions.
- API: public read endpoints; authenticated write/private read endpoints.

Definition of done
- `npm test` (or equivalent) passes
- `docker compose up` (or equivalent) starts web + API + db
- docs/ARCHITECTURE.md explains components and data flow
