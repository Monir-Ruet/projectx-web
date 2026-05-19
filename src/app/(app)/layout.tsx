import { AuthGuard } from "@/components/auth-guard";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
