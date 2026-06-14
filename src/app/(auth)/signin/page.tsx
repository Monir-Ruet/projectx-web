'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { AlertTriangleIcon, KeyIcon } from "lucide-react"
import { signIn } from "next-auth/react"
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
import { Base64 } from "js-base64"
import { reqwest } from "@/lib/fetch"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"


export default function SignIn() {
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
            const res = await reqwest('/api/auth/webauthn/login/options?email=' + signInForm.getValues('email'), {
                method: 'POST',
            });

            if (!res.ok)
                throw new Error('Failed to fetch authentication options');

            const credentialRequestOptions = await res.json();

            const publicKey = credentialRequestOptions.options.publicKey;

            publicKey.challenge = Base64.toUint8Array(publicKey.challenge);

            publicKey.allowCredentials?.forEach(
                (credential: { id: string | Uint8Array }) => {
                    if (typeof credential.id === 'string') {
                        credential.id = Base64.toUint8Array(credential.id);
                    }
                }
            );

            const assertion = await navigator.credentials.get({
                publicKey,
                mediation: "required"
            });

            if (!assertion)
                throw new Error('Authentication failed');

            const pkc = assertion as PublicKeyCredential;
            const response = pkc.response as AuthenticatorAssertionResponse;

            const signInResult = await reqwest('/api/auth/webauthn/login/verify', {
                method: 'POST',
                body: JSON.stringify({
                    auth: {
                        id: pkc.id,
                        rawId: Base64.fromUint8Array(new Uint8Array(pkc.rawId), true),
                        type: pkc.type,
                        response: {
                            authenticatorData: Base64.fromUint8Array(new Uint8Array(response.authenticatorData), true),
                            clientDataJSON: Base64.fromUint8Array(new Uint8Array(response.clientDataJSON), true),
                            signature: Base64.fromUint8Array(new Uint8Array(response.signature), true),
                            userHandle: response.userHandle ? Base64.fromUint8Array(new Uint8Array(response.userHandle), true) : null
                        }
                    },
                    state_token: credentialRequestOptions.state_token,
                }),
            });

            if (!signInResult.ok) {
                throw new Error('Failed to verify authentication');
            }

            const { access_token, refresh_token } = await signInResult.json();
            await signIn("credentials", { access_token, refresh_token, redirect: false });

            router.push("/");
            return true;
        } catch {
            setMessage("Authentication failed. Please try again.");
            return false;
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm lg:max-w-md flex-col gap-6">
                <Link href="/" className="flex items-center">
                    <Image src={"/x.png"} width={50} height={50} alt="ProjectX" className="mx-auto" />
                </Link>
                <div className={"flex flex-col gap-6"}>
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
                                        <InputGroup className="rounded-sm py-5">
                                            <InputGroupInput
                                                {...signInForm.register("email")}
                                                id="email"
                                                type="text"
                                                required
                                                autoComplete="username webauthn" />
                                            <InputGroupAddon align="inline-end">
                                                <Tooltip>
                                                    <TooltipTrigger render={
                                                        <InputGroupButton variant="secondary" onClick={handlePassKeySignin}>
                                                            <KeyIcon />
                                                        </InputGroupButton>} />
                                                    <TooltipContent>
                                                        <p>Sign in with Passkey</p>
                                                    </TooltipContent>
                                                </Tooltip>


                                            </InputGroupAddon>
                                        </InputGroup>
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
                                        <Button type="submit" disabled={loading} className="p-5 text-md font-bold">
                                            Sign In
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
            </div>
        </div>
    )
}
