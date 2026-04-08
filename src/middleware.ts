import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Constants for Session Management
const SESSION_TIMEOUT_MINUTES = 30; // Session timeout config for security

export function middleware(request: NextRequest) {
  // A basic middleware setup for authentication routing and session timeout controls
  
  // Example logic for protected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth/');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  const sessionCookie = request.cookies.get('tenant_session');

  // Handle protected route access
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Session Timeout Logic Placeholder
  // If session is older than SESSION_TIMEOUT_MINUTES, invalidate and redirect to login
  if (sessionCookie) {
    // Validate session expiry here...
    // If expired: return NextResponse.redirect(new URL('/auth/login?expired=true', request.url));
  }

  // Handle auth routes (if already authenticated, redirect to app)
  if (isAuthRoute && sessionCookie) {
    // Ideally resolve the user's tenant and redirect to their specific dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to these paths
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};
