import { PASSKEY_SIGNIN_VERIFY_ENDPOINT } from '@/constants/endpoints';
import { reqwest } from '@/lib/fetch';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const res = await reqwest(PASSKEY_SIGNIN_VERIFY_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            cred: body.auth,
            state_token: body.state_token,
        }),
    });

    if (!res.ok)
        return NextResponse.json({ error: 'Failed to verify authentication' }, { status: 500 });

    const data = await res.json();
    return NextResponse.json(data);
}
