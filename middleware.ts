import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Options
  // Required: The minimum level of user required to access this route
  // https://next-auth.js.org/configuration/pages#required

  pages: {
    signIn: "/",
  },
});


export const config = {
  matcher: [
    "/users/:path*",
  ]
}