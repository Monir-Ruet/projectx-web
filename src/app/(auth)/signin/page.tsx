import Link from "next/link"
import Image from "next/image"

import { SignInForm } from "@/components/signin"

export default function SignIn() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm lg:max-w-md flex-col gap-6">
                <Link href="/" className="flex items-center">
                    <Image src={"/x.png"} width={50} height={50} alt="ProjectX" className="mx-auto" />
                </Link>
                <SignInForm />
            </div>
        </div>
    )
}
