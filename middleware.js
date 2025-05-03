import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  // console.log(token);
  const user = verifyToken(token);
// console.log(user);
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  request.user = user; // Optional if using API route-level checks
  return NextResponse.next();
}


// Apply to specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
