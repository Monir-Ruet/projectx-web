import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "@/components/auth-guard";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
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
            <body className={`${geistSans.className} h-full antialiased text-sm`}>
                <ThemeWrapper>
                    <SessionProvider>
                        <AuthGuard />
                        {children}
                    </SessionProvider>
                </ThemeWrapper>
                <Toaster richColors closeButton theme="system" position="top-center" visibleToasts={1} duration={3000} />
            </body>
        </html >
    );
}
