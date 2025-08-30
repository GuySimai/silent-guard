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

import { Edit } from 'lucide-react';


import EditCategoryForm from "./edit-category-form";

export default function EditCategoryButton({categoryID}: {categoryID: string}) {

    return (
        <Dialog >
          <DialogTrigger asChild>
            <button  className="focus:outline-none cursor-pointer"><Edit className="w-3 h-3 text-gray-700"/></button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-sm">Edit Category Name</DialogTitle>
            </DialogHeader>
                <EditCategoryForm categoryID={categoryID} />  
          </DialogContent>
        </Dialog>
      )
  }