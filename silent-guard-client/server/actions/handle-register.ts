'use server'

//General Imports
import { actionClient } from "@/lib/safe-action";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt'

//Schema Imports
import { RegisterSchema } from "@/schemas/register-schema";
import type { RegisterSchemaType } from "@/schemas/register-schema";
import { IT_Table, usersTable } from "../db/schema";

export const handleRegister = actionClient
  .schema(RegisterSchema).action(async ({ parsedInput: { ITnumber, email, password ,name} }) => {

    //Checking if IT exists - mandatory
    const existingIT = await db
        .select()
        .from(IT_Table)
        .where( eq(IT_Table.ITnumber, ITnumber))

        if (existingIT.length === 0) {
          return { error: "Incorrect IT credentials" };
        }

        //Checking if User exists
      const existingUser = await db
       .select()
       .from(usersTable)
       .where( eq(usersTable.email, email))



      if (existingUser.length !== 0) {
        return { error: "User already exists" };
      }

      //Hashing the password
      const hashedPassword = await bcrypt.hash(password, 17);

      //Creating a new user
      await db.insert(usersTable).values({name,email,password:hashedPassword});
      return { success: "Registration completed" };


  });
