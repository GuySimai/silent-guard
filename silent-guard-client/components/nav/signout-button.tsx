"use client"

//General imports
import { signOut } from "next-auth/react";
//ShadcnUi imports
import { Button } from "../ui/button";


export default function SignOutButton() {
  return (
        <Button onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
        </Button>
  );
}