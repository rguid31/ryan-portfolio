# FEATURE: Master Report API + Privacy-First Publishing System

**Version:** 1.0
**Status:** Ready for Implementation
**Created:** 2026-02-09

---

## OVERVIEW

Build a privacy-first API and publishing system that allows users to control exactly what professional data from their Master Report JSON is publicly accessible, while keeping PII (Personally Identifiable Information) private by default.

### Problem Statement

The Master Report (`master_report.json`) contains comprehensive professional data including:
- Personal contact information (email, phone, address)
- Social media profiles  
- Work history
- Projects
- Skills
- Education
- Certifications

**Current Issue:** All data is either fully public or fully private. There's no granular control over what specific fields are published.

### Solution

Implement a **field-level privacy control system** that:
1. Keeps all PII private by default
2. Allows explicit opt-in publishing per field
3. Generates JSON-LD for SEO from published fields only
4. Provides API endpoints to query published data
5. Includes onboarding wizard to set privacy preferences

---

## KEY REQUIREMENTS

### Privacy-First Design
- All fields private by default
- Explicit opt-in per field
- PII requires double confirmation
- User controls granularity (field-level, category-level)

### API Endpoints
- GET /api/profile/public - Published fields only
- GET /api/profile/private - All fields (authenticated)
- POST /api/profile/publish - Update publish settings
- GET /api/profile/json-ld - SEO-optimized JSON-LD

### Onboarding Wizard
- Guide user through privacy choices
- Category-by-category review
- Preview before saving
- Reasonable privacy-first defaults

---

## SUCCESS CRITERIA

- Schema covers all Master Report fields
- API responses < 200ms (p95)
- Test coverage > 80%
- Onboarding completable in < 5 minutes
- Valid JSON-LD for all public profiles

**See full specification details in this file.**
