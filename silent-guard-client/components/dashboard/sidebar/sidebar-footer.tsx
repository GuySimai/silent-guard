"use client"

//General imports
import { LogOut, Settings } from 'lucide-react';
import { signOut } from "next-auth/react";
import Link from 'next/link';



export default function SideBarFooter() {
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-md transition">
        <Settings className="w-4 h-4" />
        Settings
      </Link>
      <button className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-md transition" onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}