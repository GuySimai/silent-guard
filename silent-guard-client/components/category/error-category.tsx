'use client'

import Link from "next/link";
import { Button } from "../ui/button";

export default  function CategoryIdError() {
  
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-6">
          The category does not exist.
        </p>
        <Button>
            <Link href={`/dashboard`}>
                Go Back to Dashboard
             </Link>
        </Button>
      </div>
    );
   }



