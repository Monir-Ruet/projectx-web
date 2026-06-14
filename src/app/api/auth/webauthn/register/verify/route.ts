import { PASSKEY_REGISTER_VERIFY_ENDPOINT } from '@/constants/endpoints';
import { invoke } from '@/lib/fetch';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const res = await invoke(PASSKEY_REGISTER_VERIFY_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            credential: body.credential,
            state_token: body.state_token,
        }),
    });
    if (!res.ok)
        return NextResponse.json({ verified: false, error: 'Verification failed' }, { status: 400 });

    return NextResponse.json({ verified: true });
}
