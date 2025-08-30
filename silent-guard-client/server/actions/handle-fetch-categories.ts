"use server";

//General Imports
import { eq } from "drizzle-orm";

//my Imports
import { db } from "@/server/db/db";
import { categoriesTable } from "../db/schema";

import { auth } from "@/auth";
import { use } from "react";


export const handleFetchCategories = async () => {

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId){
        throw new Error("Unauthorized: No user session found")
    }

    const userCategories = await db.select().from(categoriesTable)
    .where(eq(categoriesTable.userId, userId));

    if (userCategories.length === 0) {
        return [];
      }

    return userCategories;

    console.log("User Categories", userCategories);


}
