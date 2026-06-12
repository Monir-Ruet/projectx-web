"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({
    trickleSpeed: 400,
    minimum: 0.1,
});

export default function TopLoader() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        NProgress.done();
    }, [pathname]);

    useEffect(() => {
        const start = () => {
            NProgress.done();
            NProgress.start();
        };

        const originalPush = router.push;
        const originalReplace = router.replace;
        const originalBack = router.back;

        // eslint-disable-next-line react-hooks/immutability
        router.push = (...args: Parameters<typeof router.push>) => {
            start();
            return originalPush(...args);
        };
        router.replace = (...args: Parameters<typeof router.replace>) => {
            start();
            return originalReplace(...args);
        };
        router.back = (...args: Parameters<typeof router.back>) => {
            start();
            return originalBack(...args);
        };

        const handleLinkClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const anchor = target.closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            if (
                anchor.target === "_blank" ||
                anchor.hasAttribute("download") ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button === 1
            ) {
                return;
            }

            if (
                href.startsWith("http") ||
                href.startsWith("//") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:")
            ) {
                return;
            }

            const currentUrl = new URL(globalThis.location.href);
            const targetUrl = new URL(href, globalThis.location.origin);

            if (targetUrl.pathname === currentUrl.pathname)
                return;

            start();
        };

        document.addEventListener("click", handleLinkClick);
        window.addEventListener("load", () => NProgress.done());

        return () => {
            router.push = originalPush;
            router.replace = originalReplace;
            router.back = originalBack;
            document.removeEventListener("click", handleLinkClick);
            window.removeEventListener("load", () => NProgress.done());
        };
    }, [router]);

    return null;
}
