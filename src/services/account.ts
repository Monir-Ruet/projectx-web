import { invoke } from "@/lib/fetch";
import { PING_ENDPOINT, REFRESH_TOKEN_ENDPOINT, SIGN_IN_ENDPOINT, USER_INFO_ENDPOINT } from "@/constants/endpoints";
import { AccessTokenResponse, SignInCredentials, SignInProviderCredentials, User } from "user";

export async function signInWithCredentials(credentials: SignInCredentials): Promise<AccessTokenResponse | null> {
    const response = await invoke(SIGN_IN_ENDPOINT, {
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
        response = await fetch(USER_INFO_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } else {
        response = await invoke(USER_INFO_ENDPOINT);
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