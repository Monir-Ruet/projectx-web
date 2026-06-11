"use client"

import {
    DollarSign,
    DoorOpenIcon,
    EllipsisVertical,
    MoonIcon,
    SettingsIcon,
    UserIcon,
} from "lucide-react"
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import Link from "next/link"

export function MenuActions() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 data-[state=open]:bg-accent"
                    >
                        {session?.user ? (
                            <Avatar>
                                <AvatarImage
                                    src={
                                        session?.user?.image || ""
                                    }
                                />
                                <AvatarFallback>
                                    {session?.user?.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                            </Avatar>
                        ) : (
                            <EllipsisVertical />
                        )}
                    </Button>
                }>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64">
                    {
                        session && (
                            <>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <Link href="/profile" className="flex items-center gap-2 w-full">
                                            <UserIcon />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/billing")}>
                                        <DollarSign />
                                        Billing
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                            </>
                        )
                    }

                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Settings</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push("/settings")}>
                            <SettingsIcon />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <MoonIcon />
                                Appearance: {theme && theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
                                {
                                    ["system", "dark", "light"].map((option, index) => (
                                        <DropdownMenuCheckboxItem
                                            key={index}
                                            checked={option == theme}
                                            onCheckedChange={() => {
                                                setTheme(option)
                                            }}
                                        >
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </DropdownMenuCheckboxItem>
                                    ))
                                }
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>

                    {
                        session && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={async () => {
                                        await signOut({
                                            redirectTo: "/refresh",
                                        });
                                    }}>
                                        <DoorOpenIcon />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </>
                        )
                    }

                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}
