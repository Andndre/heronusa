import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { checkRateLimit, getClientIP, applyRateLimitHeaders } from "@/lib/rate-limiter";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIP(request);
  const rateLimit = await checkRateLimit(ip);

  if (!rateLimit.success) {
    return applyRateLimitHeaders(
      NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan coba lagi." },
        { status: 429 }
      ),
      rateLimit
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pathname = new URL(request.url).pathname;
  const publicRoutes = ["/login", "/forgot-password", "/api/auth"];
  const isLoggedIn = !!session;

  let response: NextResponse;

  if (isLoggedIn || publicRoutes.some((route) => pathname.startsWith(route))) {
    response = NextResponse.next();
  } else {
    response = NextResponse.redirect(new URL("/login", request.url));
  }

  return applyRateLimitHeaders(response, rateLimit);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
