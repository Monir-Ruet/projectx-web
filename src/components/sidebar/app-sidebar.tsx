"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/sidebar/nav-main"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader></SidebarHeader>
            <SidebarContent>
                <NavMain />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
