import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware((req) => {
  // Allow public routes
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up')) {
    return;
  }

  // Protect all other routes
  if (!req.auth) {
    const loginUrl = new URL('/sign-in', req.url);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};