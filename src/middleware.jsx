export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/managementSubjects/:path*", "/managementTutors/:path*", "/support/:path*", "/forum/:path*"],
};