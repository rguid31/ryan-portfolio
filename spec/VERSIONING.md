# Versioning + Snapshots (MVP)

Terms
- Draft: mutable canonical profile + visibility settings.
- Snapshot: immutable published public dataset derived from draft.

On publish
- Validate draft against canonical schema.
- Derive public dataset using privacy rules.
- Validate public dataset against public schema.
- Compute:
  - versionId: UUID v4
  - publishedAt: ISO-8601 timestamp
  - lastUpdated: same as publishedAt (MVP)
  - contentHash: sha256 of canonicalized public JSON (stable key ordering)

Storage
- Store every snapshot (append-only).
- Mark latest snapshot pointer per handle.

Public endpoints
- /u/{handle}.json returns latest snapshot.
- /u/{handle}.jsonld returns JSON-LD derived from latest snapshot.
- Optional /u/{handle}/changes.json returns list of snapshot headers:
  - versionId, publishedAt, contentHash

Delete behavior
- Delete removes draft + all snapshots + index entries.
