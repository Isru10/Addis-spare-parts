// src/types/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';

// Declare a new interface for our user model to use in callbacks
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  phone?: string;
  createdAt?: string;

}

declare module 'next-auth' {
  /**
   * Extends the built-in session.user object.
   * Now we can use `session.user.id` and `session.user.role` on the client.
   */
  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin' | 'superadmin';
    } & DefaultSession['user']; // Keep the default properties like name, email, image
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT token.
   * Now we can use `token.id` and `token.role` in the JWT callback.
   */
  interface JWT {
    id: string;
    role: 'user' | 'admin' | 'superadmin';
  }
}