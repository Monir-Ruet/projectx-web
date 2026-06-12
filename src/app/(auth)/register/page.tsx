'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Base64 } from 'js-base64';
import { reqwest } from '@/lib/fetch';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const optionsRes = await reqwest('/api/auth/webauthn/register/options', {
                method: 'POST',
            });

            if (!optionsRes.ok)
                throw new Error('Failed to get registration options');

            const { options, state_token } = await optionsRes.json();

            options.publicKey.challenge = Base64.toUint8Array(options.publicKey.challenge);
            options.publicKey.user.id = Base64.toUint8Array(options.publicKey.user.id);

            options.publicKey.excludeCredentials?.forEach(
                (credential: { id: string | Uint8Array }) => {
                    if (typeof credential.id === 'string') {
                        credential.id = Base64.toUint8Array(credential.id);
                    }
                }
            );

            const credential = await navigator.credentials.create({
                publicKey: options.publicKey,
            });

            if (!credential)
                throw new Error('Credential creation failed');

            const publicKeyCredential = credential as PublicKeyCredential;
            const response = publicKeyCredential.response as AuthenticatorAttestationResponse;

            const verificationRes = await reqwest('/api/auth/webauthn/register/verify', {
                method: 'POST',
                body: JSON.stringify({
                    credential: {
                        id: publicKeyCredential.id,
                        rawId: Base64.fromUint8Array(new Uint8Array(publicKeyCredential.rawId), true),
                        type: publicKeyCredential.type,
                        response: {
                            attestationObject: Base64.fromUint8Array(new Uint8Array(response.attestationObject), true),
                            clientDataJSON: Base64.fromUint8Array(new Uint8Array(response.clientDataJSON), true),
                        },
                    },
                    state_token,
                }),
            }
            );

            if (verificationRes.ok) {
                toast.success('Registration successful! You can now log in.');
            } else {
                throw new Error('Registration verification failed');
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
