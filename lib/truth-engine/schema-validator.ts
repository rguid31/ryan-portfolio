// Truth Engine — JSON Schema validation using AJV
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import canonicalSchema from '../../spec/canonical.schema.json';
import publicSchema from '../../spec/public.schema.json';
import type { ValidationResult, CanonicalProfile, PublicProfile } from './types';

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

const validateCanonical = ajv.compile(canonicalSchema);
const validatePublic = ajv.compile(publicSchema);

/**
 * Validate a canonical profile draft against canonical.schema.json.
 */
export function validateCanonicalProfile(data: unknown): ValidationResult {
    const valid = validateCanonical(data);
    if (valid) {
        return { isValid: true, fields: [] };
    }

    const fields = (validateCanonical.errors || []).map((err) => ({
        path: err.instancePath || '/',
        message: err.message || 'Unknown validation error',
        severity: 'error' as const,
    }));

    return { isValid: false, fields };
}

/**
 * Validate a public profile snapshot against public.schema.json.
 */
export function validatePublicProfile(data: unknown): ValidationResult {
    const valid = validatePublic(data);
    if (valid) {
        return { isValid: true, fields: [] };
    }

    const fields = (validatePublic.errors || []).map((err) => ({
        path: err.instancePath || '/',
        message: err.message || 'Unknown validation error',
        severity: 'error' as const,
    }));

    return { isValid: false, fields };
}
