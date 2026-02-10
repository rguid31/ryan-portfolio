# Privacy + Publishing Rules (MVP)

Principles
- Canonical draft may contain private and public fields.
- Public dataset is derived from canonical draft using:
  1) visibility settings
  2) hard-private defaults
  3) explicit allowlist mapping to the public schema

PII defaults (private unless explicitly allowed)
- contact.phone
- contact.emails[*] where type="personal"
- dateOfBirth
- address.street1, address.street2, address.postalCode
- any "notes" fields (MVP: omit from public entirely)

MVP visibility model (section-level)
Visibility object:
{
  "sections": {
    "identity": "public|private",
    "links": "public|private",
    "experience": "public|private",
    "education": "public|private",
    "skills": "public|private",
    "projects": "public|private",
    "contact": "public|private"
  },
  "overrides": {
    "/contact/emails": "public|private",
    "/contact/phone": "public|private"
  }
}

Rules
- If a section is "private", it is omitted from the public dataset.
- Overrides apply only if the parent section is public.
- Even if overrides mark a PII path as public, the backend should still default to NOT publishing phone/personal email unless the user explicitly toggles it (MVP keeps overrides, but UI must make it intentional).

Public allowlist mapping
- identity: name, headline, location (city/region/country), image, summary (optional)
- links: website + sameAs URLs
- experience: role entries minus private notes
- education: entries
- skills: categories + items
- projects: entries
- contact:
  - allowed public: publicEmail only (type="public"), optional phone if explicitly public (not recommended)
  - never public: dateOfBirth, street address fields

Unpublish
- Public endpoints must return 404 after unpublish.
- Snapshots may remain stored but not publicly accessible (MVP choice).
- Delete removes everything (draft + snapshots + indexes).

Compliance note
- The platform must provide:
  - Export of public dataset
  - Delete account/profile
  - Clear labeling of what is public
