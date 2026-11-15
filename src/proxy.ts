import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { languageCookie } from "@/lib/localization";

export async function proxy(request: NextRequest) {
  const locale = /^\/(en|de)(?:\/|$)/.exec(request.nextUrl.pathname)?.[1];
  if (locale) {
    const response = NextResponse.next({ request });
    if (!request.headers.has("next-router-prefetch") && request.headers.get("purpose") !== "prefetch") {
      response.cookies.set(languageCookie, locale, { path: "/", sameSite: "lax", maxAge: 31536000 });
    }
    return response;
  }
  const config = getSupabaseConfig();
  if (!config) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    { source: "/en/:path*", missing: [{ type: "header", key: "next-router-prefetch" }, { type: "header", key: "purpose", value: "prefetch" }] },
    { source: "/de/:path*", missing: [{ type: "header", key: "next-router-prefetch" }, { type: "header", key: "purpose", value: "prefetch" }] },
  ],
};
