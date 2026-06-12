import { auth } from "@/auth";

export async function invoke(url: string, init?: RequestInit) {
    const token = await auth();
    return reqwest(url, {
        ...init,
        headers: {
            ...(token && { Authorization: `Bearer ${token?.user.accessToken}` }),
        },
    });
}

export async function reqwest(url: string, init?: RequestInit) {
    return fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers),
        },
        credentials: 'include'
    });
}
