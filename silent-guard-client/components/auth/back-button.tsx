// HyperLink from Nextjs
import Link from "next/link";

//------ShadcnUi Imports---------
import { Button } from "@/components/ui/button";


export default function BackButton({label,href} : {label: string, href: string}){
    return (
    <Button variant={"link"} className="w-full flex justify-center" asChild>
        <Link href={href}>
            {label}
        </Link>
    </Button>
    )
}   