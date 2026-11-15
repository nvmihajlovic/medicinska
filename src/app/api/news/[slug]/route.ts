import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { engagementClient, resolveNewsKey } from "@/lib/news-engagement";
import { consentCookie, parseConsent, visitorCookie } from "@/lib/cookie-consent";
import { isSameOrigin } from "@/lib/request-origin";
import { readLimitedBody } from "@/lib/request-body";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const unavailable = () => NextResponse.json({ error: "Бројачи тренутно нису доступни." }, { status: 503 });

function setVisitor(response: NextResponse, visitor: string, previous: string) {
  if (visitor !== previous) {
    response.cookies.set(visitorCookie, visitor, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return response;
}

async function stats(client: NonNullable<ReturnType<typeof engagementClient>>, key: string, visitor: string | null) {
  const { data: counts, error } = await client.from("news_engagement").select("views, likes").eq("news_key", key).maybeSingle();
  if (error) throw new Error("Бројачи вести нису могли да се учитају.", { cause: error });
  let liked = false;
  if (visitor) {
    const { data, error: likeError } = await client.from("news_likes").select("visitor_id")
      .eq("news_key", key).eq("visitor_id", visitor).maybeSingle();
    if (likeError) throw new Error("Лајк није могао да се провери.", { cause: likeError });
    liked = Boolean(data);
  }
  return { views: Number(counts?.views ?? 0), likes: Number(counts?.likes ?? 0), liked };
}

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!parseConsent(request.cookies.get(consentCookie)?.value)?.analytics) return NextResponse.json({ error: "Потребна је сагласност за бројаче." }, { status: 403 });
  const client = engagementClient();
  if (!client) return unavailable();
  const { slug } = await context.params;
  const key = await resolveNewsKey(slug);
  if (!key) return NextResponse.json({ error: "Вест није пронађена." }, { status: 404 });
  const cookie = request.cookies.get(visitorCookie)?.value ?? "";
  const visitor = uuid.test(cookie) ? cookie : randomUUID();
  const data = await stats(client, key, visitor);
  return setVisitor(NextResponse.json(data, { headers: { "Cache-Control": "no-store" } }), visitor, cookie);
}

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!parseConsent(request.cookies.get(consentCookie)?.value)?.analytics) return NextResponse.json({ error: "Потребна је сагласност за бројаче." }, { status: 403 });
  const client = engagementClient();
  if (!client) return unavailable();
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Захтев није дозвољен." }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "Неисправан захтев." }, { status: 400 });
  }
  let action: unknown;
  try {
    const body = await readLimitedBody(request, 256);
    if (body === null) return NextResponse.json({ error: "Захтев је превелик." }, { status: 400 });
    action = JSON.parse(body)?.action;
  } catch {
    return NextResponse.json({ error: "Неисправан захтев." }, { status: 400 });
  }
  if (action !== "view" && action !== "like") return NextResponse.json({ error: "Непозната радња." }, { status: 400 });
  const { slug } = await context.params;
  const key = await resolveNewsKey(slug);
  if (!key) return NextResponse.json({ error: "Вест није пронађена." }, { status: 404 });

  const cookie = request.cookies.get(visitorCookie)?.value ?? "";
  const visitor = uuid.test(cookie) ? cookie : randomUUID();
  const { error } = await client.rpc(action === "view" ? "record_news_view" : "toggle_news_like", {
    p_news_key: key,
    p_visitor_id: visitor,
  });
  if (error) {
    console.error("Интеракција са вешћу није сачувана.", error);
    return setVisitor(unavailable(), visitor, cookie);
  }
  const data = await stats(client, key, visitor);
  const response = NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  return setVisitor(response, visitor, cookie);
}
