'use client';

import { useEffect } from "react";

export default function RefreshPage() {
    useEffect(() => {
        globalThis.location.href = "/";
    }, []);
    return (
        <div>Redirecting...</div>
    );
}
