"use server";

//General Imports
import { and, eq } from "drizzle-orm";

//Schema Imports


//my Imports
import { db } from "@/server/db/db";
import { camerasTable } from "../db/schema";


export const handleDeleteCamera = async (id:string)=>{

    try{
    const res = await db.delete(camerasTable).where(eq(camerasTable.id, id))
    }catch(error) {
    console.error("Error deleting camera:", error);
    return { error: "Failed to delete camera" };
  }

}
   
