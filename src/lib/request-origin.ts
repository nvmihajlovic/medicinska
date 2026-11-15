import type { NextRequest } from "next/server";

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  return origin === request.nextUrl.origin || Boolean(host && origin === `${request.nextUrl.protocol}//${host}`);
}
