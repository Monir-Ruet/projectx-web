import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const response = NextResponse.redirect(new URL('/signin', req.url))
    response.cookies.delete('authjs.session-token')

    return response
}
