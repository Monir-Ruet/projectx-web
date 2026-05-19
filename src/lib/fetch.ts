import { auth } from "@/auth";

export async function invoke(url: string, init?: RequestInit) {
    const token = await auth();
    return fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
            ...(token && { Authorization: `Bearer ${token?.user.accessToken}` }),
        },
    });
}