import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isProtectedRoute = createRouteMatcher(['/', '/profile(.*)', '/events(.*)', '/surveys(.*)']);

const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/signup(.*)',
  '/forgot-password(.*)',
  '/terms-of-service',
  '/privacy-policy',
  '/api/webhook(.*)',
  '/survey/(.*)/check-winner',
  '/survey/(.*)/winner/(.*)',
  '/survey/(.*)/reward/(.*)'
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  },
  { debug: false }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
