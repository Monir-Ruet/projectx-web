import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "@/components/auth-guard";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ProjectX",
    description: "ProjectX is a platform that allows you to manage your projects and tasks in a simple and efficient way.",
    icons: {
        icon: "/x.webp",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
                <ThemeWrapper>
                    <SessionProvider>
                        <AuthGuard />
                        {children}
                    </SessionProvider>
                </ThemeWrapper>
            </body>
        </html >
    );
}
