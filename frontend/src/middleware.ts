import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL(role === 'client' ? '/chat' : '/', request.url));
    }
  }

  // Protect Client routes
  if (pathname.startsWith('/chat') || pathname.startsWith('/review')) {
    if (role !== 'client' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/chat/:path*', '/review/:path*'],
};
