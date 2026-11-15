import { NextResponse, type NextRequest } from "next/server";
import { languageCookie } from "@/lib/localization";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale");
  const next = request.nextUrl.searchParams.get("next");
  if ((locale !== "sr" && locale !== "en" && locale !== "de") || !next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return new NextResponse("Invalid language selection", { status: 400 });
  }
  const target = new URL(next, request.url);
  if (target.origin !== request.nextUrl.origin) return new NextResponse("Invalid destination", { status: 400 });
  const response = NextResponse.redirect(target);
  response.cookies.set(languageCookie, locale, { path: "/", sameSite: "lax", maxAge: 31536000 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
