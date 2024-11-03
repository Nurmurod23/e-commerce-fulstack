import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authSession = request.cookies.get('auth_session');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (!authSession && !isAuthPage && request.nextUrl.pathname === '/checkout') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (authSession && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout', '/auth/:path*'],
};