import { auth } from "@/auth";
import { SignOut } from "@/components/signout";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const session = await auth()
    return (
        <div className="text-sm">{
            session ? (
                <div>
                    <div>Session : {session.user.id}</div>
                    <p>Welcome, {session.user?.name}!</p>
                    <Image src={session.user?.image || "/default-profile.png"} alt="PP" width={50} height={50} />
                    <SignOut />
                </div>
            ) : (
                <>
                    <Link href={"/signin"}>Go to Sign In Page</Link>
                    <p>You are not signed in.</p>
                </>
            )
        }
            <ThemeToggle />
        </div>

    );
}
