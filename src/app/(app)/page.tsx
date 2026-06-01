import { auth } from "@/auth";
import Image from "next/image";

export default async function Home() {
    const session = await auth()
    return (
        <div className="text-sm">{
            session && (
                <div>
                    <p>Welcome, {session.user?.name}!</p>
                    <Image src={session.user?.image || "/default-profile.png"} alt="PP" width={50} height={50} loading="eager" />
                </div>
            )
        }
        </div>
    );
}
