// src/middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // 1. Protect the /superadmin route
    if (pathname.startsWith("/superadmin") && token?.role !== "superadmin") {
      // If user is not a superadmin, redirect them to their profile or home
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // 2. Protect the /admin route
    if (pathname.startsWith("/admin") && token?.role !== "admin" && token?.role !== "superadmin") {
      // If user is not an admin or superadmin, redirect them
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // 3. Protect the /profile route
    if (pathname.startsWith("/profile") && !token) {
        // If user is not logged in at all, redirect to login
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If all checks pass, allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback is used to decide if the middleware should run.
      // We return true if a token exists, which means the user is logged in.
      authorized: ({ token }) => !!token,
    },
  }
);

// This config specifies which routes the middleware should run on.
export const config = {
  matcher: [
    "/admin/:path*",
    "/superadmin/:path*",
    "/profile/:path*",
  ],
};