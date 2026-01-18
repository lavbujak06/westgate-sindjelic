import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/admin/highlights')) {
    return NextResponse.redirect(new URL('/', req.url))
    // Redirect them to the home page (or return a 404)
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};