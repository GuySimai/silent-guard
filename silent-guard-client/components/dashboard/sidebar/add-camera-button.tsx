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
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"

import AddCameraForm from "./add-camera-form"
import { Camera} from "lucide-react";

export default function AddCameraButton({categoryID}: {categoryID: string}) {

    return (
        <Dialog >
          <DialogTrigger asChild>
            <button  className="focus:outline-none cursor-pointer"><Camera className="w-3 h-3 text-gray-700" /></button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Camera</DialogTitle>
              <DialogDescription>
               Fill the authorization details for the camera
              </DialogDescription>
            </DialogHeader>
                <AddCameraForm categoryID={categoryID}/>  
          </DialogContent>
        </Dialog>
      )
  }