'use client'

import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react'; // Make sure to import appropriate icons
import Link from 'next/link';

export default function SideBarView() {

    return (
      <div className="flex flex-col gap-2 ">
      <Button variant={"ghost"}
       asChild
       className={`flex items-center gap-2 text-sm cursor-pointer bg-transparent border-white p-2 transition`}  >
          <Link href="/dashboard/recordings">
          <Video className="w-4 h-4" />
          Recordings
          </Link>
        
      </Button>
    </div>
    )
  }