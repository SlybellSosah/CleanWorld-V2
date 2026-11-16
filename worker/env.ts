export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  RESEND_API_KEY?: string;
  NOTIFY_FROM?: string;
  NOTIFY_TO?: string;
  TURNSTILE_SECRET?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_DEV_BYPASS?: string;
}

export type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;
