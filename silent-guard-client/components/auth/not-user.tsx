import Link from "next/link";
import { Button } from "../ui/button";

export default function NotUser() {
        return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg mb-8">You are not authorized to view this page.</p>
            <Button asChild>
                <Link href="/auth/login">Login</Link>
            </Button>
        </div>
    );
 }
    