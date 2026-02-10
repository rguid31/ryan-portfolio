// Truth Engine — TypeScript types for the platform data model

// ─── Canonical (Private) Types ───────────────────────────────────

export interface CanonicalProfile {
    schemaVersion: string;
    handle: string;
    identity: {
        name: string;
        headline?: string;
        summary?: string;
        image?: string;
        location?: {
            city?: string;
            region?: string;
            country?: string;
        };
        dateOfBirth?: string; // PII — private by default
    };
    links?: {
        website?: string;
        sameAs?: string[];
    };
    contact?: {
        phone?: string; // PII — private by default
        emails?: Array<{
            email: string;
            type: 'public' | 'personal' | 'school' | 'work';
        }>;
    };
    address?: {
        // PII — private by default (entire section)
        street1?: string;
        street2?: string;
        city?: string;
        region?: string;
        postalCode?: string;
        country?: string;
    };
    experience?: Array<{
        organization: string;
        title: string;
        location?: string;
        startDate?: string;
        endDate?: string;
        isCurrent?: boolean;
        highlights?: string[];
        tags?: string[];
        privateNotes?: string; // Never public
    }>;
    education?: Array<{
        institution: string;
        program?: string;
        degree?: string;
        startDate?: string;
        endDate?: string;
        status?: 'completed' | 'in-progress' | 'incomplete' | 'withdrawn';
    }>;
    skills?: Array<{
        category: string;
        items: string[];
    }>;
    projects?: Array<{
        name: string;
        description?: string;
        tech?: string[];
        url?: string;
        repoUrl?: string;
        role?: string;
        highlights?: string[];
        privateNotes?: string; // Never public
    }>;
}

// ─── Visibility Settings ─────────────────────────────────────────

export type VisibilityLevel = 'public' | 'private';

export interface VisibilitySettings {
    sections: {
        identity: VisibilityLevel;
        links: VisibilityLevel;
        experience: VisibilityLevel;
        education: VisibilityLevel;
        skills: VisibilityLevel;
        projects: VisibilityLevel;
        contact: VisibilityLevel;
    };
    overrides: {
        [jsonPointer: string]: VisibilityLevel;
    };
}

export const DEFAULT_VISIBILITY: VisibilitySettings = {
    sections: {
        identity: 'public',
        links: 'public',
        experience: 'public',
        education: 'public',
        skills: 'public',
        projects: 'public',
        contact: 'private', // Contact private by default
    },
    overrides: {
        '/contact/emails': 'private',
        '/contact/phone': 'private',
    },
};

// ─── Public Snapshot Types ───────────────────────────────────────

export interface PublicProfile {
    schemaVersion: string;
    handle: string;
    versionId: string;
    lastUpdated: string;
    contentHash: string;
    identity: {
        name: string;
        headline?: string;
        summary?: string;
        image?: string;
        location?: {
            city?: string;
            region?: string;
            country?: string;
        };
        // No dateOfBirth — always redacted
    };
    links?: {
        website?: string;
        sameAs?: string[];
    };
    contact?: {
        publicEmail?: string;
        phone?: string; // Only if explicitly published
    };
    experience?: Array<{
        organization: string;
        title: string;
        location?: string;
        startDate?: string;
        endDate?: string;
        isCurrent?: boolean;
        highlights?: string[];
        tags?: string[];
        // No privateNotes — always redacted
    }>;
    education?: Array<{
        institution: string;
        program?: string;
        degree?: string;
        startDate?: string;
        endDate?: string;
        status?: 'completed' | 'in-progress' | 'incomplete' | 'withdrawn';
    }>;
    skills?: Array<{
        category: string;
        items: string[];
    }>;
    projects?: Array<{
        name: string;
        description?: string;
        tech?: string[];
        url?: string;
        repoUrl?: string;
        // No privateNotes — always redacted
    }>;
}

// ─── Database Row Types ──────────────────────────────────────────

export interface UserRow {
    id: number;
    email: string;
    password_hash: string;
    created_at: string;
}

export interface HandleRow {
    id: number;
    user_id: number;
    handle: string;
    status: 'active' | 'reserved' | 'deleted';
    created_at: string;
}

export interface ProfileDraftRow {
    id: number;
    user_id: number;
    canonical_json: string;
    visibility_json: string;
    updated_at: string;
}

export interface ProfileSnapshotRow {
    id: number;
    handle: string;
    version_id: string;
    public_json: string;
    jsonld_json: string;
    content_hash: string;
    schema_version: string;
    is_published: number; // SQLite boolean
    created_at: string;
}

export interface SearchIndexRow {
    handle: string;
    name: string;
    headline: string | null;
    skills: string | null; // comma-separated
    location: string | null;
    organizations: string | null; // comma-separated
    titles: string | null; // comma-separated
    updated_at: string;
}

// ─── API Types ───────────────────────────────────────────────────

export interface ApiError {
    code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'CONFLICT' | 'INTERNAL' | 'RATE_LIMIT_EXCEEDED';
    message: string;
    fields?: Array<{
        path: string;
        message: string;
        severity: 'error' | 'warn';
    }>;
}

export interface ValidationResult {
    isValid: boolean;
    fields: Array<{
        path: string;
        message: string;
        severity: 'error' | 'warn';
    }>;
}

export interface PublishResult {
    published: true;
    handle: string;
    versionId: string;
    publishedAt: string;
    contentHash: string;
    urls: {
        html: string;
        json: string;
        jsonld: string;
    };
}

export interface SnapshotHeader {
    versionId: string;
    publishedAt: string;
    contentHash: string;
}
