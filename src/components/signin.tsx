'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { AlertTriangleIcon, Key } from "lucide-react"
import { signIn } from "next-auth/react"
import { startAuthentication } from "@simplewebauthn/browser"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { signInSchema, signInZodSchema } from "@/schemas/account"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import Link from "next/link"

export function SignInForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>("");
    const [loading, setLoading] = useState(false);
    const signInForm = useForm<signInSchema>({
        resolver: zodResolver(signInZodSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

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
            router.push("/");
        }
    };

    const handlePassKeySignin = async () => {
        try {
            const optionsRes = await fetch('/api/auth/webauthn/login/options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!optionsRes.ok) throw new Error('Failed to fetch authentication options');
            const options = await optionsRes.json();

            const assertionResponse = await startAuthentication(options.options);
            const verificationRes = await fetch('/api/auth/webauthn/login/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-webauthn-csrf': options.csrfToken,
                },
                body: JSON.stringify({
                    assertionResponse,
                    challengeToken: options.challengeToken,
                }),
            });

            if (!verificationRes.ok) {
                throw new Error('Failed to verify authentication');
            }

            const { verified, passkeyToken } = await verificationRes.json();
            if (verified) {
                await signIn("credentials", { passkeyToken, redirect: false });
                router.push("/");
            } else {
                throw new Error('Authentication not verified');
            }
        } catch {
            setMessage("Authentication failed. Please try again.");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={signInForm.handleSubmit(handleSignIn)} >
                        <FieldGroup>
                            <Field>
                                <div className="flex gap-2 justify-center">
                                    <Button variant="outline" type="button" onClick={() => signIn("google", { callbackUrl: "/" })}>
                                        <Image src="/google.svg" alt="Google" width={20} height={20} />
                                        Google
                                    </Button>
                                    <Button variant="outline" type="button" onClick={() => signIn("github", { callbackUrl: "/" })}>
                                        <Image src={"/github.svg"} width={20} height={20} alt="github" />
                                        Github
                                    </Button>
                                    <Button variant="outline" type="button" onClick={(e) => {
                                        e.preventDefault();
                                        handlePassKeySignin()
                                    }}>
                                        <Key className="w-5 h-5" />
                                        Passkey
                                    </Button>
                                </div>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            {
                                message &&
                                (
                                    <Alert className="max-w-md border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 ">
                                        <AlertTriangleIcon />
                                        <AlertDescription className="text-amber-900 dark:text-amber-50">
                                            {message}
                                        </AlertDescription>
                                    </Alert>
                                )
                            }

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...signInForm.register("email")}
                                    id="email"
                                    type="text"
                                    required
                                    className="rounded-sm p-5"
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Link href="/forgot-password" className="ml-auto  underline-offset-4 hover:underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    {...signInForm.register("password")}
                                    id="password"
                                    type="password"
                                    required
                                    className="rounded-sm p-5"
                                />
                            </Field>
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    Login{ }
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">
                                        Sign up
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                </Link>{" "}
                and <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                </Link>.
            </FieldDescription>
        </div>
    )
}
