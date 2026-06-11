'use client'

import Link from "next/link";
import { useEffect } from "react";
import NProgress from "nprogress";

export default function NotFound() {
    useEffect(() => {
        NProgress.done();
    }, []);
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-xs hover:bg-blue-700 transition">
                Go Back Home
            </Link>
        </div>
    )
}
