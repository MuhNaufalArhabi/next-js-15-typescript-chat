import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  console.log('Token:', token);

  const { pathname } = req.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // If user is accessing `/auth` but already has token, redirect to `/chat`
  if (pathname === '/auth' && token) {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  // If user is accessing any page except `/auth` but has no token, redirect to `/auth`
  if (pathname !== '/auth' && !token) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  return NextResponse.next();
}
