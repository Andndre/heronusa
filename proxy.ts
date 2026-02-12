import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const publicRoutes = ["/login", "/forgot-password", "/api/auth"];

  const isLoggedIn = !!session;

  // Allow public routes
  if (publicRoutes.some((route) => new URL(request.url).pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
