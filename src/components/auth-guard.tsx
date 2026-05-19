"use client"

import { useEffect } from "react"
import { signOut, useSession } from "next-auth/react"

export function AuthGuard() {
    const { data: session } = useSession()

    useEffect(() => {
        if (
            session?.error ===
            "RefreshAccessTokenError"
        ) {
            signOut({
                callbackUrl: "/signin",
            })
        }
    }, [session])

    return null
}