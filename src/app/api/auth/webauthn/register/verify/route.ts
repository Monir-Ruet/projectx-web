import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { save_passkey } from '@/services/account';
import { auth } from '@/auth';
import {
    assertTrustedOrigin,
    getRelyingPartyConfig,
    requireCsrfHeader,
    validateChallengeToken,
} from '@/services/webauthn';
import type { WebAuthnRegistrationVerifyRequest } from '@/types/webauthn';

export async function POST(req: NextRequest) {

    try {
        const authUser = await auth();
        if (!authUser?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { expectedOrigin, rpID } = getRelyingPartyConfig(req);
        assertTrustedOrigin(req, expectedOrigin);
        const csrfToken = requireCsrfHeader(req);

        const { attestationResponse, challengeToken } = await req.json() as WebAuthnRegistrationVerifyRequest;
        const { challenge } = validateChallengeToken({
            token: challengeToken,
            expectedOrigin,
            expectedPurpose: 'registration',
            csrfToken,
            expectedUserId: authUser.user.id,
        });

        const verification = await verifyRegistrationResponse({
            response: attestationResponse,
            expectedChallenge: challenge,
            expectedRPID: rpID,
            expectedOrigin,
        });

        const { verified, registrationInfo } = verification;

        if (!verified || !registrationInfo) {
            return NextResponse.json({ verified: false, error: 'Registration verification failed' }, { status: 400 });
        }

        const { credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp } = registrationInfo;
        const is_success = await save_passkey({
            credential_id: Buffer.from(credentialID).toString('base64url'),
            public_key: Buffer.from(credentialPublicKey).toString('base64url'),
            counter,
            device_type: credentialDeviceType,
            backed_up: credentialBackedUp,
            user_id: authUser.user.id,
        });

        return NextResponse.json({ verified: is_success });
    }
    catch {
        return NextResponse.json({ verified: false, error: 'Registration verification failed' }, { status: 400 });
    }
}
