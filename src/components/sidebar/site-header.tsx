"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { MenuActions } from "./nav-actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";

export function SiteHeader() {
    const { data: session, status } = useSession();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-sidebar">
            <div className="flex items-center gap-2 px-4 justify-between w-full">
                <SidebarTrigger className="-ml-1" />
                {
                    status === "loading" ? (
                        <div className="ml-auto h-10 w-24" />
                    ) : (
                        <div className="flex items-center gap-2 ml-10">
                            <MenuActions />
                            {
                                !session?.user && (
                                    <div className="flex flex-row gap-2 items-center">
                                        <Link href="/signin" className="flex flex-row gap-1 py-1 px-2 items-center justify-between border dark:border-[#55564e] rounded-full text-blue-500 dark:text-blue-400 font-bold">
                                            <CircleUserRound />
                                            Sign in
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </header>
    );
}
