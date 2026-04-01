export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// FDF uses Supabase auth — all unauthenticated users go to /signin, never to
// the Manus OAuth portal. This helper replaces the old getLoginUrl() so any
// remaining call-sites still compile but route correctly.
export const getLoginUrl = () => "/signin";
