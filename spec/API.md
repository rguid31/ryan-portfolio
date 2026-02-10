# API Contract (MVP)

Conventions
- JSON only.
- Errors use a standard shape:
  {
    "code": "VALIDATION_ERROR" | "NOT_FOUND" | "UNAUTHORIZED" | "FORBIDDEN" | "CONFLICT" | "INTERNAL",
    "message": "string",
    "fields": [{ "path": "/json/pointer", "message": "string", "severity": "error"|"warn" }]
  }

## Public

### GET /.well-known/truth-engine.json
200:
{
  "platform": "truth-engine",
  "schemaVersion": "1.0.0",
  "endpoints": {
    "profileHtml": "/u/{handle}",
    "profileJson": "/u/{handle}.json",
    "profileJsonLd": "/u/{handle}.jsonld",
    "query": "/api/query"
  },
  "lastUpdated": "ISO-8601"
}

### GET /u/:handle
- Returns HTML page (not specified here).

### GET /u/:handle.json
200: Public profile snapshot (must validate schema/public.schema.json)
404: if handle not found OR not published

### GET /u/:handle.jsonld
200: JSON-LD derived from the latest published public snapshot
404: if handle not found OR not published

### GET /u/:handle/changes.json (optional MVP)
200:
{
  "handle": "string",
  "schemaVersion": "1.0.0",
  "changes": [
    { "versionId": "uuid", "publishedAt": "ISO-8601", "contentHash": "sha256-hex" }
  ]
}
404: if not found OR not published ever

## Authenticated (User)

### GET /api/profile/me
200:
{
  "handle": "string",
  "published": boolean,
  "draft": <canonical object>,
  "visibility": <visibility object>,
  "latestPublished": { "versionId": "uuid", "publishedAt": "ISO-8601" } | null
}

### POST /api/profile/draft
Request:
{
  "draft": <canonical object>,
  "visibility": <visibility object>
}
200:
{
  "saved": true,
  "draftUpdatedAt": "ISO-8601",
  "validation": {
    "isValid": boolean,
    "fields": [{ "path": "/json/pointer", "message": "string", "severity": "error"|"warn" }]
  }
}

### POST /api/profile/publish
Request:
{ "confirm": true }
200:
{
  "published": true,
  "handle": "string",
  "versionId": "uuid",
  "publishedAt": "ISO-8601",
  "contentHash": "sha256-hex",
  "urls": {
    "html": "/u/{handle}",
    "json": "/u/{handle}.json",
    "jsonld": "/u/{handle}.jsonld"
  }
}
409 CONFLICT: no draft exists
422 VALIDATION_ERROR: schema/visibility errors

### POST /api/profile/unpublish
Request:
{ "confirm": true }
200:
{ "published": false }

### DELETE /api/profile
Request:
{ "confirm": true }
200:
{ "deleted": true }

## Owner/Admin Query

### GET /api/query?skill=&org=&title=&location=&updatedAfter=&limit=&cursor=
200:
{
  "results": [
    {
      "handle": "string",
      "name": "string",
      "headline": "string",
      "location": { "city": "string", "region": "string", "country": "string" },
      "sameAs": ["url", "..."],
      "lastUpdated": "ISO-8601",
      "versionId": "uuid"
    }
  ],
  "nextCursor": "string|null"
}
Notes:
- Only returns public data.
- Filtering is substring/contains for MVP.
