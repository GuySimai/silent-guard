import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas/login-schema";
import { db } from "./server/db/db";
import { usersTable } from "./server/db/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from 'bcrypt';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validateFields = LoginSchema.safeParse(credentials);

        if(!validateFields.success) return null;

        const { email, password } = validateFields.data;

        //Hashing password and comparing it with the hashed password in the database
        const existingUser = await db
        .select()
        .from(usersTable)
        .where(
          eq(usersTable.email, email)
        );

        if (existingUser.length === 0) {
          return null;
        }

        const checkPassword = await bcrypt.compare(password, existingUser[0].password);
        
        if(!checkPassword) {
          return null;
        }


        const user = existingUser[0];

        if (!user) {
          return null;
        }

        // return user object with their profile data
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks:{
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  }
});
