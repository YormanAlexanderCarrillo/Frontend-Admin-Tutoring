// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const roleBasedMiddleware = withAuth(async (req) => {
  //console.log(req.nextauth.token.user.userData);
  const { role } = req.nextauth.token.user.userData;

  const adminRoutes = ["/managementSubjects", "/managementTutors", "/materialSupport"];
  const tutorRoutes = ["/managementTutorings", "/managementForum"];

  const pathname = req.nextUrl.pathname;

  if (adminRoutes.some(route => pathname.startsWith(route)) && role !== "ADMINISTRATOR") {
    return NextResponse.redirect(new URL("/unauthorized", req.url)); 
  }

  if (tutorRoutes.some(route => pathname.startsWith(route)) && role !== "TUTOR") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}, {
  pages: {
    signIn: "/login",
  },
});

export default roleBasedMiddleware;

export const config = {
  matcher: [
    "/managementSubjects/:path*",
    "/managementTutors/:path*",
    "/materialSupport/:path*",
    "/managementForum/:path*",
    "/managementTutorings/:path*",
  ],
};
