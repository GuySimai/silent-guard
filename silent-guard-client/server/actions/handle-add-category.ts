"use server";

//General Imports
import { actionClient } from "@/lib/safe-action";
import { CategorySchema } from "@/schemas/category-schema";

//my Imports
import { db } from "@/server/db/db";
import { categoriesTable, usersTable } from "../db/schema";
import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";


export const handleAddCategory = async ({name,color}:{name:string,color:string}) => {

    const session = await auth();
    const userId = session?.user?.id;

    console.log("User ID:", userId);

    if (!userId){
        throw new Error("Unauthorized: No user session found")
    }

       //Checkings to see if the user exists and if the category name and color already exists
        const existingUser = await db.select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));


        if (existingUser.length === 0) {
          return { error: "User not found, cannot add category" };
        }

        const existingCategory = await db.select()
        .from(categoriesTable)
        .where(
            and(
                eq(categoriesTable.name, name),
                eq(categoriesTable.userId, userId)
               )    
        )

        if(existingCategory.length > 0) {
          return { error: "Category name already exists, Select a new name!" };
        }

        const existingCategoryColor = await db.select()
        .from(categoriesTable)
        .where(
            and(
                eq(categoriesTable.color, color),
                eq(categoriesTable.userId, userId)
               )    
        )

        if(existingCategoryColor.length > 0) {
          return { error: "Category color already exists, Select a new color!" };
        }


        //----Here after we passed the checks-------------
        await db.insert(categoriesTable).values({name,color,userId});
        return { success: "Category added" };
      };

