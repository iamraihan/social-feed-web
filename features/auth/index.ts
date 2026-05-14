// Client-safe public API of the `auth` feature.
//
// Server-only helpers (getSession, requireSession, getAccessToken) are
// deliberately NOT re-exported here — they live in `./lib/session` behind
// `'server-only'` and must be imported via the deep path so the marker
// stays effective and they never bleed into a client bundle.
export { LoginForm } from './components/login-form';
export { RegisterForm } from './components/register-form';
export { loginAction, type LoginActionResult } from './actions/login-action';
export { registerAction, type RegisterActionResult } from './actions/register-action';
export { logoutAction } from './actions/logout-action';
export type { SessionUser, AuthTokens, UserStatus } from './types';
