import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (pathname.startsWith('/login') || !pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check for auth cookie / token
  const token = req.cookies.get('sb-access-token')?.value;

  if (!token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // You could also add admin role check here if desired
  return NextResponse.next();
}

// Apply middleware only to admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
