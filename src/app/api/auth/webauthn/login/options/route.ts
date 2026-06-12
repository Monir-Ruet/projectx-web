import { PASSKEY_SIGNIN_OPTIONS_ENDPOINT } from '@/constants/endpoints';
import { reqwest } from '@/lib/fetch';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const res = await reqwest(`${PASSKEY_SIGNIN_OPTIONS_ENDPOINT}?${searchParams.toString()}`, {
            method: 'POST',
        });
        if (!res.ok) {
            throw new Error('Failed to fetch authentication options');
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to generate authentication options' }, { status: 500 });
    }
}
