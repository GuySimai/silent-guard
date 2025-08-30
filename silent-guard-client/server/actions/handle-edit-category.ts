"use server";

//General Imports
import { and, eq } from "drizzle-orm";

//Schema Imports


//my Imports
import { db } from "@/server/db/db";
import { categoriesTable } from "../db/schema";


export const handleEditCategory = async (name:string,id:string)=>{

    try{
    const res = await db.update(categoriesTable).set({name}).where(eq(categoriesTable.id, id))
}catch(error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category" };
  }

}
   
