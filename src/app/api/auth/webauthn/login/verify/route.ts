import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';

import {
    find_user_by_id,
    find_user_passkey,
    save_passkey,
    signInPassKey,
} from '@/services/account';
import { verifyJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { assertionResponse, challengeToken } = body;

        const user = await find_user_by_id(assertionResponse.response.userHandle);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const { challenge } = verifyJwt(challengeToken) as { challenge: string };

        const passKey = await find_user_passkey(assertionResponse.id);
        if (!passKey) {
            return NextResponse.json(
                { error: 'Passkey not found' },
                { status: 404 }
            );
        }

        const verification = await verifyAuthenticationResponse({
            response: assertionResponse,
            expectedChallenge: challenge,
            expectedRPID: process.env.NEXTAUTH_URL?.replace('https://', '').replace('http://', '') || 'localhost',
            expectedOrigin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
            authenticator: {
                credentialPublicKey: Buffer.from(passKey.public_key, 'base64url'),
                credentialID: Buffer.from(passKey.credential_id, 'base64url'),
                counter: passKey.counter || 0,
            },
        });

        const { verified, authenticationInfo } = verification;

        if (!verified || !authenticationInfo) {
            return NextResponse.json(
                { error: 'Authentication not verified' },
                { status: 401 }
            );
        }

        const newCounter = authenticationInfo.newCounter;

        if (typeof newCounter === 'number') {
            await save_passkey({
                ...passKey,
                counter: newCounter,
            });
        }

        const passkeyToken = await signInPassKey(user.id) as { passkey_token: string } | null;
        if (!passkeyToken) {
            return NextResponse.json(
                { error: 'Failed to generate passkey token' },
                { status: 500 }
            );
        }
        return NextResponse.json({
            verified: true,
            passkeyToken: passkeyToken?.passkey_token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to verify authentication' },
            { status: 500 }
        );
    }
}
