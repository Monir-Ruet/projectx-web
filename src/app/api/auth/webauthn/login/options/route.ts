import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import {
    assertTrustedOrigin,
    createChallengeToken,
    generateChallenge,
    generateCsrfToken,
    getRelyingPartyConfig,
    WEBAUTHN_CHALLENGE_TTL_SECONDS,
} from '@/services/webauthn';

export async function POST(req: NextRequest) {
    try {
        const { expectedOrigin, rpID } = getRelyingPartyConfig(req);
        assertTrustedOrigin(req, expectedOrigin);
        const challenge = generateChallenge();
        const csrfToken = generateCsrfToken();

        const options = await generateAuthenticationOptions({
            rpID,
            userVerification: 'preferred',
            challenge,
            timeout: WEBAUTHN_CHALLENGE_TTL_SECONDS * 1000,
            allowCredentials: [],
        });

        const challengeToken = createChallengeToken({
            challenge,
            csrfToken,
            origin: expectedOrigin,
            purpose: 'authentication',
        });

        return NextResponse.json({
            options,
            challengeToken,
            csrfToken,
            expiresIn: WEBAUTHN_CHALLENGE_TTL_SECONDS,
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to generate authentication options' },
            { status: 400 }
        );
    }
}
