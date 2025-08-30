"use server";

import { auth } from "@/auth";


export const getCurrentUserId = async () => {

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId){
        throw new Error("Unauthorized: No user session found")
    }

    return userId;

}
