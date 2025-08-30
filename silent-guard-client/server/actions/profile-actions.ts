"use server"

import { revalidatePath } from "next/cache"
import { db } from "../db/db"
import { usersTable } from "../db/schema"
import { eq } from "drizzle-orm"
import bcrypt from 'bcrypt';
import { getCurrentUserId } from "./getCurrentUserId"


// This is a placeholder for your actual database operations
// You would replace this with your Drizzle/Neon implementation
interface ProfileUpdateData {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  profileImage?: string | null
}

export async function updateProfile(data: ProfileUpdateData) {

  // Add a small delay to simulate server processing
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real implementation, you would:
  // 1. Verify the current password if provided
  // 2. Update the user record in your Neon database using Drizzle
  // 3. If there's a new profile image, upload it to your storage solution

  const userId = await getCurrentUserId()

  
  if (data.currentPassword && data.newPassword) {

     //Checking if User exists
    const existingUser = await db
    .select()
    .from(usersTable)
    .where( eq(usersTable.id, userId))

    if (existingUser.length === 0) {
        throw new Error("User not found");
    }
    
    const user = existingUser[0];

   // Verify current password
if (
    existingUser.length === 0 || 
    !await bcrypt.compare(data.currentPassword, user.password)
  ) {
    throw new Error("Current password is incorrect");
  }

  // Optional: check if new password is same as current
    if (await bcrypt.compare(data.newPassword, user.password)) {
    throw new Error("New password must be different from current password");
  }

  // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    
    // Update with new password
    await db.update(usersTable)
      .set({ 
        password: hashedPassword,
        image: data.profileImage,
      })
      .where(eq(usersTable.id, userId))
  } 
  
  revalidatePath("/settings")
  return { success: true }
}
