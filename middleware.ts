import { NextResponse, type NextRequest } from "next/server";

const DEV_HOST_PATTERNS = [
  "localhost",
  "127.0.0.1",
  ".repl.co",
  ".replit.dev",
  ".picard.replit.dev",
];

function isDevHost(host: string | null): boolean {
  if (!host) return false;
  return DEV_HOST_PATTERNS.some(pattern => host.includes(pattern));
}

export function middleware(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");

  if (proto === "http" && !isDevHost(host)) {
    const redirectUrl = new URL(request.url);
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  const response = NextResponse.next();
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("Content-Security-Policy", "upgrade-insecure-requests");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
