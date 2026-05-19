import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export const proxy = auth(async (request: NextRequest) => {
    const user = await auth();
    if (user) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
})

export const config = {
    matcher: '/signin',
}