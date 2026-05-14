import { NextResponse, type NextRequest } from 'next/server';

// Route-protection proxy (renamed from `middleware` in Next.js 16). Runs on
// the edge before any Server Component renders, so unauthenticated users
// never see protected page HTML and authenticated users never re-see the
// auth pages.
//
// Why gate on `refresh_token` and NOT `session_user`:
//   - `refresh_token` is httpOnly — only the backend (via setSessionCookies)
//     can mint it; client-side JS / XSS cannot forge one.
//   - `session_user` is intentionally non-httpOnly so Client Components can
//     read it for UX. Trusting it at the proxy edge would let any XSS write
//     `document.cookie = "session_user=…"` and bypass auth entirely.
//
// Proxy validates only that *some* refresh token cookie exists. The backend
// is the only place that can verify the token is genuine and not revoked —
// that happens on every authenticated API call.
//
// IMPORTANT: this runs on the Edge runtime. Do NOT import from
// `features/auth/lib/session.ts` here — that file is Node-only.

const SESSION_GATE_COOKIE = 'refresh_token';
const AUTH_PATHS = new Set<string>(['/login', '/register']);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has(SESSION_GATE_COOKIE);

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

// Skip Next.js internals, public assets, backend uploads, and API routes —
// only run on user-facing pages.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets/|uploads/|api/).*)',
  ],
};
