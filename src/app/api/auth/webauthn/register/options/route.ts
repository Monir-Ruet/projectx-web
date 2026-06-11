import { NextRequest, NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { auth } from '@/auth';
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
        const authUser = await auth();
        if (!authUser?.user?.id || !authUser.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { expectedOrigin, rpID } = getRelyingPartyConfig(req);
        assertTrustedOrigin(req, expectedOrigin);

        const challenge = generateChallenge();
        const csrfToken = generateCsrfToken();
        const options = await generateRegistrationOptions({
            rpName: process.env.WEBAUTHN_RP_NAME || 'ProjectX',
            rpID,
            userID: authUser.user.id,
            userName: authUser.user.email,
            userDisplayName: authUser.user.name || authUser.user.email,
            challenge,
            timeout: WEBAUTHN_CHALLENGE_TTL_SECONDS * 1000,
            attestationType: 'none',
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'preferred',
            },
        });

        const challengeToken = createChallengeToken({
            challenge,
            csrfToken,
            origin: expectedOrigin,
            purpose: 'registration',
            userId: authUser.user.id,
        });

        return NextResponse.json({
            options,
            challengeToken,
            csrfToken,
            expiresIn: WEBAUTHN_CHALLENGE_TTL_SECONDS,
        });
    } catch (error) {
        console.error('WebAuthn register options failed', error);
        return NextResponse.json({ error: 'Unable to generate registration options' }, { status: 500 });
    }
}
