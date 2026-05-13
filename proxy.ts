import { NextResponse, type NextRequest } from 'next/server';

// Route-protection proxy (renamed from `middleware` in Next.js 16). Runs on
// the edge before any Server Component renders, so unauthenticated users
// never see protected page HTML and authenticated users never re-see the
// auth pages.
//
// The `session_user` cookie is the only thing checked here — it's set
// alongside the auth tokens in setSessionCookies() and cleared on logout.
// We deliberately don't validate the access token: that's the backend's job
// on every API call, and the proxy should stay fast.

const SESSION_COOKIE = 'session_user';
const AUTH_PATHS = new Set<string>(['/login', '/register']);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has(SESSION_COOKIE);

  if (AUTH_PATHS.has(pathname)) {
    return hasSession
      ? NextResponse.redirect(new URL('/', req.url))
      : NextResponse.next();
  }

  if (!hasSession) {
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Skip Next.js internals, public assets, and API routes — only run on
// user-facing pages.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|api/).*)'],
};
