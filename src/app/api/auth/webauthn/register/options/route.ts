import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { signJwt } from '@/lib/jwt';
import { auth } from '@/auth';

export async function POST() {
    const authUser = await auth();
    if (!authUser?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const options = await generateRegistrationOptions({
        rpName: 'ProjectX',
        rpID: process.env.NEXTAUTH_URL?.replace('https://', '')?.replace('http://', '') || 'localhost',
        userID: authUser.user?.id,
        userName: authUser.user?.email || "",
        userDisplayName: authUser.user?.name || "",
        attestationType: 'none',
        authenticatorSelection: {
            residentKey: 'required',
            userVerification: 'preferred',
        },
    });

    const challengeToken = signJwt({ challenge: options.challenge }, { expiresIn: '15s' });

    return NextResponse.json({
        options,
        challengeToken,
    });
}
