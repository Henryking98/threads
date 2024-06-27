import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Define public routes that do not require authentication
  publicRoutes: ['/sign-in', '/sign-up'],
  // Define routes to be ignored by the middleware
  ignoredRoutes: ['/api/webhook/clerk'],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};


// import { authMiddleware } from "@clerk/nextjs/server";

// export default authMiddleware({
//   publicRoutes: ['/', '/api/webhook/clerk'],
//   ignoredRoutes: ['/api/webhook/clerk']
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
