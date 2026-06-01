"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} variant="link" size="icon" className="mx-2">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-120 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-120 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
