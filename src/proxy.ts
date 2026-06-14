import { auth } from "@/auth"
import { NextResponse } from "next/server"

const PROTECTED_ROUTES = ["/dashboard", "/profile"]
const UNAUTHENTICATED_ONLY_ROUTES = ["/signin", "/register"]
const AUTH_ROUTES = ["/signin", "/register", "/signout", "/refresh"]

export const proxy = auth((request) => {
    const session = request.auth
    const path = request.nextUrl.pathname

    if (AUTH_ROUTES.some(route => path.startsWith(route))) {
        return NextResponse.next()
    }

    if (session?.error === "RefreshAccessTokenError") {
        const signoutUrl = new URL('/signout', request.url)
        return NextResponse.redirect(signoutUrl)
    }

    if (!session && PROTECTED_ROUTES.some(route => path.startsWith(route))) {
        const signinUrl = new URL('/signin', request.url)
        signinUrl.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(signinUrl)
    }

    if (session && UNAUTHENTICATED_ONLY_ROUTES.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
