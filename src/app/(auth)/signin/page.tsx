"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInSchema, signInZodSchema } from "@/schemas/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangleIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { useForm } from "react-hook-form";

export default function SignInPage() {
    const [message, setMessage] = useState<string | null>("");
    const signInForm = useForm<signInSchema>({
        resolver: zodResolver(signInZodSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (data: signInSchema) => {
        setLoading(true);
        setMessage(null);
        const signInResult = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        setLoading(false);
        if (signInResult.error) {
            setMessage("Invalid email or password");
        } else {
            window.location.href = "/";
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-sm flex flex-col gap-2">
                <Image src={"/x.png"} width={50} height={50} alt="github" className="mx-auto" />
                <h1 className="text-xl font-bold text-center mb-2">
                    Sign in to your account
                </h1>

                {message &&
                    (
                        <Alert className="rounded-sm border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                            <AlertTriangleIcon />
                            <AlertDescription>
                                {message}
                            </AlertDescription>
                        </Alert>
                    )
                }

                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email address</label>
                        <input
                            {...signInForm.register("email")}
                            type="text"
                            id="email"
                            required
                            className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div>
                            <label htmlFor="password">Password</label>
                            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline float-right">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            {...signInForm.register("password")}
                            type="password"
                            id="password"
                            required
                            className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-green-600 py-2 rounded-sm hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {loading ? "Signing in" : "Sign in"}
                    </button>
                </form>

                <div className="flex items-center my-2">
                    <div className="flex-1 h-px bg-secondary" />
                    <span className="px-3  text-foreground">or</span>
                    <div className="flex-1 h-px bg-secondary" />
                </div>

                <div className="flex flex-col gap-2 mb-2">
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="w-full border p-2 rounded-sm transition flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-900"
                    >
                        <Image
                            src="/google.svg"
                            alt="Google"
                            width={20} height={20}
                        />
                        Sign in with Google
                    </button>
                    <button
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        className="w-full border p-2 rounded-sm transition flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-900"
                    >
                        <Image src={"/github.svg"} width={20} height={20} alt="github" />
                        Sign in with GitHub
                    </button>
                </div>
                <div >
                    New here?{" "}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        Create an account
                    </Link>
                </div>

            </div>
        </div>
    );
}