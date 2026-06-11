'use client';

import { useState } from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const optionsRes = await fetch('/api/auth/webauthn/register/options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!optionsRes.ok) {
                setLoading(false);
                return;
            }
            const registrationOptions = await optionsRes.json();
            const attestationResponse = await startRegistration(registrationOptions.options);

            const verificationRes = await fetch('/api/auth/webauthn/register/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-webauthn-csrf': registrationOptions.csrfToken,
                },
                body: JSON.stringify({
                    attestationResponse,
                    challengeToken: registrationOptions.challengeToken,
                }),
            });

            const { verified } = await verificationRes.json();
            if (verified) {
                toast.success('Registration successful! You can now log in.');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } catch {
            toast.error('An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleRegister} disabled={loading}>
                {loading ? 'Creating Passkey...' : 'Register with Passkey'}
            </button>
        </div>
    );
}
