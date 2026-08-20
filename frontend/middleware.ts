import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only strictly private account management routes require server-side auth gate
// Checkout and Track Order are public so customers and guests can freely place & track orders
const protectedPaths = [
  '/profile',
  '/addresses',
  '/account/settings'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Never block order tracking or public checkout
  if (path.startsWith('/orders/track') || path.startsWith('/checkout') || path.startsWith('/account')) {
    return NextResponse.next();
  }

  const isProtected = protectedPaths.some(p => path.startsWith(p));

  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(path));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/addresses/:path*',
    '/account/settings/:path*'
  ],
}
