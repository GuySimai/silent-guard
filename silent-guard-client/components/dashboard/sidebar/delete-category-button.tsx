'use client'

//Shadcn UI Imports
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import AddCameraForm from "./add-camera-form"
import { Ban } from 'lucide-react';
import { handleDeleteCategory } from "@/server/actions/handle-delete-category";
import { useRouter } from "next/navigation";


export default function DeleteCategoryButton({categoryID}: {categoryID: string}) {
  const router = useRouter();

  const handleDeleteCategorySubmit = async (categoryID: string) => {
      const res = await handleDeleteCategory(categoryID);
      if(res?.error) {
        console.error("Error updating category:", res.error);
        return;
    }
    // If the update is successful, you can redirect or show a success message

    router.push("/dashboard");
  }

    return (
        <Dialog >
          <DialogTrigger asChild>
            <button  className="focus:outline-none cursor-pointer"><Ban className="w-3 h-3 text-red-400" /></button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            
            <DialogHeader>
            <DialogTitle className="text-md">Delete Category!</DialogTitle>
              <DialogDescription className="uppercase">
                 Are you sure you want to delete this category?
              </DialogDescription>
            </DialogHeader>
                <Button variant="destructive" className="w-full cursor-pointer" onClick={()=> handleDeleteCategorySubmit(categoryID)}> Delete Category</Button>
          </DialogContent>
        </Dialog>
      )
  }