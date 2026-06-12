import { PASSKEY_REGISTER_VERIFY_ENDPOINT } from '@/constants/endpoints';
import { invoke } from '@/lib/fetch';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const res = await invoke(PASSKEY_REGISTER_VERIFY_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                credential: body.credential,
                state_token: body.state_token,
            }),
        });
        if (!res.ok)
            throw new Error('Verification failed');

        return NextResponse.json({ verified: true });
    }
    catch {
        return NextResponse.json({ verified: false, error: 'Verification failed' }, { status: 400 });
    }
}
