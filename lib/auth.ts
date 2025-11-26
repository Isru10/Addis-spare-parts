// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { IUser } from "@/types/next-auth"; // Assumes you created the type definition file

export const authOptions: NextAuthOptions = {
  // 1. CONFIGURE AUTHENTICATION PROVIDERS
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // 2. DEFINE THE SESSION STRATEGY
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token.addis-parts`, // UNIQUE NAME
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // 3. SPECIFY CUSTOM CALLBACKS (NOW TYPE-SAFE)
  callbacks: {
    /**
     * This callback is called whenever a user successfully signs in.
     * We connect to the DB and create a new user if they don't exist.
     */
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return false; // Only allow Google provider
      }

      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            // phone defaults to "" and role defaults to "user" via the schema
          });
        }
        return true; // Allow the sign-in
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Prevent sign-in on error
      }
    },

    /**
     * This callback is called whenever a JWT is created or updated.
     * We enrich the token with the user's database ID and role.
     */
    async jwt({ token, user }) {
      if (user) {
        // This is the initial sign-in
        await dbConnect();
        // Tell lean() what shape the returned object will have
        const dbUser = await User.findOne({ email: user.email }).lean<IUser>();

        if (dbUser) {
          // Now TypeScript knows that dbUser has _id and role
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          
        }
      }
      return token;
    },

    /**
     * This callback is called whenever a session is checked.
     * We transfer the custom data (id, role) from the token to the
     * client-side session object.
     */
    async session({ session, token }) {
      if (token && session.user) {
        // Our custom type declarations ensure this is type-safe
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // 4. DEFINE CUSTOM PAGES (OPTIONAL, BUT GOOD PRACTICE)
  pages: {
    signIn: '/login', // Redirect users to /login if they need to sign in
    // error: '/auth/error', // A page to handle authentication errors
  },

  // 5. ADD THE SECRET
  secret: process.env.NEXTAUTH_SECRET,
};