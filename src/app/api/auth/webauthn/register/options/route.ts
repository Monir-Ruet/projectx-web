import { NextResponse } from 'next/server';
import { PASSKEY_REGISTER_OPTIONS_ENDPOINT } from '@/constants/endpoints';
import { invoke } from '@/lib/fetch';

export async function POST() {
    try {
        const res = await invoke(PASSKEY_REGISTER_OPTIONS_ENDPOINT, {
            method: 'POST',
        });
        if (!res.ok) {
            throw new Error('Failed to fetch registration options');
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to generate registration options' }, { status: 500 });
    }
}
