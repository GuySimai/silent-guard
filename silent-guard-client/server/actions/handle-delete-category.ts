"use server";

//General Imports
import { and, eq } from "drizzle-orm";

//Schema Imports


//my Imports
import { db } from "@/server/db/db";
import { categoriesTable } from "../db/schema";


export const handleDeleteCategory = async (id:string)=>{

    try{
    const res = await db.delete(categoriesTable).where(eq(categoriesTable.id, id))
    }catch(error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category" };
  }

}
   
