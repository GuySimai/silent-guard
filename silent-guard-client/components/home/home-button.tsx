
//UI imports
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";


export default async function HomeButton(){

    const session = await auth();
    
    if (session) {
        return (
            <Button asChild className="rounded-3xl w-1/3">
                <Link href="/dashboard">
                    Go to Dashboard
                </Link>
            </Button>
        )
    }

    return (
        <Button asChild className="rounded-3xl w-1/3">
            <Link href="/auth/login">
                Get Started
            </Link>
        </Button>
    )
}