import { NextRequest, NextResponse } from "next/server";
import { consentCookie, consentMaxAge, consentValue, visitorCookie } from "@/lib/cookie-consent";
import { isSameOrigin } from "@/lib/request-origin";
import { readLimitedBody } from "@/lib/request-body";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Захтев није дозвољен." }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "Неисправан захтев." }, { status: 400 });
  }
  let data: unknown;
  try {
    const text = await readLimitedBody(request, 256);
    if (text === null) return NextResponse.json({ error: "Неисправан захтев." }, { status: 400 });
    data = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Неисправан захтев." }, { status: 400 });
  }
  if (!data || typeof data !== "object" || !("analytics" in data) || !("video" in data) ||
      typeof data.analytics !== "boolean" || typeof data.video !== "boolean") {
    return NextResponse.json({ error: "Неисправан избор." }, { status: 400 });
  }
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  const options = { sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
  response.cookies.set(consentCookie, consentValue(data.analytics, data.video), { ...options, maxAge: consentMaxAge });
  if (!data.analytics) response.cookies.set(visitorCookie, "", { ...options, httpOnly: true, maxAge: 0 });
  return response;
}
