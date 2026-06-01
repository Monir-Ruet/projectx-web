import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { signJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        const rpID = process.env.NODE_ENV === 'production' ? process.env.RP_ID || new URL(req.nextUrl.origin).hostname : 'localhost';

        const options = await generateAuthenticationOptions({
            rpID,
            userVerification: 'preferred',
            allowCredentials: []
        });

        const challengeToken = signJwt({ challenge: options.challenge }, { expiresIn: '15s' });

        return NextResponse.json({
            options,
            challengeToken,
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to generate authentication options' },
            { status: 500 }
        );
    }
}
