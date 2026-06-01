import { invoke } from "@/lib/fetch";
import { PING_ENDPOINT, REFRESH_TOKEN_ENDPOINT, SIGN_IN_ENDPOINT, ME_ENDPOINT, USER_BY_EMAIL_ENDPOINT, WEBAUTHN_CHALLENGE_ENDPOINT, PASSKEY_ENDPOINT, USER_BY_ID_ENDPOINT, SIGNIN_PASSKEY_ENDPOINT, VERIFY_PASSKEY_ENDPOINT } from "@/constants/endpoints";
import { AccessTokenResponse, ChallengeRequest, SignInCredentials, SignInProviderCredentials, User, WebAuthnChallenge, PassKey } from "user";

export async function signInWithCredentials(credentials: SignInCredentials): Promise<AccessTokenResponse | null> {
    const response = await fetch(SIGN_IN_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(credentials),
    })

    return response.ok ? await response.json() : null
}

export async function signInWithProvider(provider: string, credential: SignInProviderCredentials): Promise<AccessTokenResponse | null> {
    const response = await fetch(`${SIGN_IN_ENDPOINT}/${provider}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
    })

    return response.ok ? await response.json() : null
}

export async function me(accessToken?: string): Promise<User | null> {
    let response;
    if (accessToken) {
        response = await fetch(ME_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } else {
        response = await invoke(ME_ENDPOINT);
    }
    return response.ok ? await response.json() : null
}

export async function refresh(refreshToken?: string): Promise<AccessTokenResponse | null> {
    const response = await fetch(REFRESH_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
    })
    return response.ok ? await response.json() : null
}

export async function is_authenticated(accessToken?: string): Promise<boolean> {
    const response = await fetch(PING_ENDPOINT, accessToken ? {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    } : {});
    return response.ok;
}

export async function find_user_by_email(email: string): Promise<User | null> {
    const response = await fetch(`${USER_BY_EMAIL_ENDPOINT}/${encodeURIComponent(email)}`);
    return response.ok ? await response.json() : null;
}

export async function find_user_by_id(id: string): Promise<User | null> {
    const response = await fetch(`${USER_BY_ID_ENDPOINT}/${encodeURIComponent(id)}`);
    return response.ok ? await response.json() : null;
}

export async function add_update_webauthn_challenge(request: ChallengeRequest): Promise<boolean> {
    const response = await invoke(WEBAUTHN_CHALLENGE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(request),
    });
    return response.ok;
}

export async function find_webauthn_challenge(user_id: string): Promise<WebAuthnChallenge | null> {
    const response = await fetch(`${WEBAUTHN_CHALLENGE_ENDPOINT}?user_id=${encodeURIComponent(user_id)}`);
    return response.ok ? await response.json() : null;
}

export async function find_user_passkey(credential_id: string): Promise<PassKey | null> {
    const response = await fetch(`${PASSKEY_ENDPOINT}?credential_id=${encodeURIComponent(credential_id)}`);
    return response.ok ? await response.json() : null;
}

export async function save_passkey(passkey: PassKey): Promise<boolean> {
    const response = await fetch(PASSKEY_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(passkey),
    });
    return response.ok;
}


export async function signInPassKey(id: string) {
    const response = await fetch(`${SIGNIN_PASSKEY_ENDPOINT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });
    return response.ok ? await response.json() : null;
}

export async function verifyPassKey(passKeyToken: string) {
    const response = await fetch(`${VERIFY_PASSKEY_ENDPOINT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ passkey_token: passKeyToken }),
    });
    return response.ok ? await response.json() : null;
}
