import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseBrowserEnv } from "./env";

export function createClient() {
  const { url, anon } = requireSupabaseBrowserEnv();
  return createBrowserClient(url, anon);
}
