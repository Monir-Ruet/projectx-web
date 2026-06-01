import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { save_passkey } from '@/services/account';
import { auth } from '@/auth';
import { verifyJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {

    try {
        const authUser = await auth();
        const { attestationResponse, challengeToken } = await req.json();
        const { challenge } = verifyJwt(challengeToken) as { challenge: string };

        const verification = await verifyRegistrationResponse({
            response: attestationResponse,
            expectedChallenge: challenge,
            expectedRPID: process.env.NEXTAUTH_URL?.replace('https://', '')?.replace('http://', '') || 'localhost',
            expectedOrigin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
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
            user_id: authUser?.user?.id,
        });

        return NextResponse.json({ verified: is_success });
    }
    catch {
        return NextResponse.json({ verified: false, error: 'Verification failed' }, { status: 400 });
    }
}
