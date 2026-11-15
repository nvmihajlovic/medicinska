import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const mediaUrl = supabaseUrl
  ? new URL("storage/v1/object/public/school-media/", `${supabaseUrl.replace(/\/+$/, "")}/`)
  : null;
if (mediaUrl && mediaUrl.protocol !== "https:" && mediaUrl.protocol !== "http:") {
  throw new Error("Supabase URL мора да користи HTTP или HTTPS.");
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    remotePatterns: mediaUrl ? [{
      protocol: mediaUrl.protocol === "https:" ? "https" : "http",
      hostname: mediaUrl.hostname,
      port: mediaUrl.port,
      pathname: `${mediaUrl.pathname}**`,
    }] : [],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'" },
      ],
    }];
  },
};

export default nextConfig;
