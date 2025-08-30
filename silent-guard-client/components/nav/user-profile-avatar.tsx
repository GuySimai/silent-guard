'use client'

//General imports
import Link from "next/link";
import { signOut } from "next-auth/react";

//ShadcnUi imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//Auth imports
import { Session } from "next-auth";
import { LogOut } from "lucide-react";

export default function UserProfileAvatar({session}:{session: Session}) {

  if(!session) {
    return null
  }

  if(!session.user?.image) {
    session.user!.image = "/profile-avatar.png"
  }

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="size-10">
          <AvatarImage src={session.user?.image}/>
          <AvatarFallback className="bg-blue-300">{session.user?.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <Link href={`/dashboard`}>
            Dashboard
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <Link href={`/dashboard/settings`}>
            Settings
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuLabel className="h-full w-full">
          <button className="flex w-full h-full text-white gap-2 p-2 rounded-lg justify-center items-center cursor-pointer bg-blue-400" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </DropdownMenuLabel>
    
      </DropdownMenuContent>
    </DropdownMenu>
   
  );
}