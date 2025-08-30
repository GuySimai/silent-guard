"use server";

//General Imports
import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";

//Schema Imports
import { LoginSchema } from "@/schemas/login-schema";

//my Imports
import { db } from "@/server/db/db";
import { usersTable } from "../db/schema";

import { signIn } from "@/auth";

export const handleLogin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {

    //Checking if User exists
    const existingUser = await db
    .select()
    .from(usersTable)
    .where( eq(usersTable.email, email))

    if (existingUser.length === 0) {
      return { error: "Incorrect credentials" };
    }

    //Auth SignIn function, using credentials provider.
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard", //Redirect to home page after sign in
      });

      return { success: "Successfully logged in" };
    }
);