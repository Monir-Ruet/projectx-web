import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

import type {
    WebAuthnChallengePayload,
    WebAuthnChallengeValidationInput,
} from '@/types/webauthn';

export const WEBAUTHN_CSRF_HEADER = 'x-webauthn-csrf';
export const WEBAUTHN_CHALLENGE_TTL_SECONDS = 120;

const WEBAUTHN_JWT_AUDIENCE = 'projectx-webauthn';
const WEBAUTHN_JWT_ISSUER = 'projectx-web';

function compareTokenValue(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
}

function getChallengeSecret(): string {
    const secret = process.env.WEBAUTHN_CHALLENGE_SECRET || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Missing WEBAUTHN_CHALLENGE_SECRET/JWT_SECRET');
    }

    return secret;
}

function getRequestOrigin(req: NextRequest): string {
    const origin = req.headers.get('origin');
    if (origin) {
        return new URL(origin).origin;
    }

    const referer = req.headers.get('referer');
    if (referer) {
        return new URL(referer).origin;
    }

    throw new Error('Missing request origin');
}

export function getRelyingPartyConfig(req: NextRequest): { expectedOrigin: string; rpID: string } {
    const expectedOrigin = new URL(process.env.NEXTAUTH_URL || req.nextUrl.origin).origin;
    const configuredRpId = process.env.RP_ID;
    const rpID = configuredRpId || new URL(expectedOrigin).hostname;

    return { expectedOrigin, rpID };
}

export function assertTrustedOrigin(req: NextRequest, expectedOrigin: string): void {
    const requestOrigin = getRequestOrigin(req);
    if (requestOrigin !== expectedOrigin) {
        throw new Error('Untrusted origin');
    }

    const fetchSite = req.headers.get('sec-fetch-site');
    if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
        throw new Error('Cross-site request blocked');
    }
}

export function generateChallenge(): string {
    return randomBytes(32).toString('base64url');
}

export function generateCsrfToken(): string {
    return randomBytes(32).toString('base64url');
}

export function createChallengeToken(input: Omit<WebAuthnChallengePayload, 'nonce'>): string {
    const payload: WebAuthnChallengePayload = {
        ...input,
        nonce: randomUUID(),
    };

    return jwt.sign(payload, getChallengeSecret(), {
        algorithm: 'HS256',
        audience: WEBAUTHN_JWT_AUDIENCE,
        issuer: WEBAUTHN_JWT_ISSUER,
        expiresIn: WEBAUTHN_CHALLENGE_TTL_SECONDS,
    });
}

export function validateChallengeToken(input: WebAuthnChallengeValidationInput): WebAuthnChallengePayload {
    const decoded = jwt.verify(input.token, getChallengeSecret(), {
        algorithms: ['HS256'],
        audience: WEBAUTHN_JWT_AUDIENCE,
        issuer: WEBAUTHN_JWT_ISSUER,
    }) as JwtPayload & WebAuthnChallengePayload;

    if (decoded.purpose !== input.expectedPurpose) {
        throw new Error('Challenge purpose mismatch');
    }

    if (typeof decoded.origin !== 'string' || decoded.origin !== input.expectedOrigin) {
        throw new Error('Challenge origin mismatch');
    }

    if (typeof decoded.challenge !== 'string') {
        throw new Error('Invalid challenge');
    }

    if (typeof decoded.csrfToken !== 'string' || !compareTokenValue(decoded.csrfToken, input.csrfToken)) {
        throw new Error('Invalid csrf token');
    }

    if (input.expectedUserId && decoded.userId !== input.expectedUserId) {
        throw new Error('Challenge user mismatch');
    }

    return decoded;
}

export function requireCsrfHeader(req: NextRequest): string {
    const csrfToken = req.headers.get(WEBAUTHN_CSRF_HEADER);
    if (!csrfToken) {
        throw new Error('Missing csrf header');
    }

    return csrfToken;
}

export function decodeUserHandle(userHandle?: string | null): string | null {
    if (!userHandle) {
        return null;
    }

    try {
        return Buffer.from(userHandle, 'base64url').toString('utf-8');
    } catch {
        return null;
    }
}
