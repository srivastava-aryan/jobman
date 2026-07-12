import { NextRequest, NextResponse } from "next/server";

/**
 * Basic Auth gate for the whole app, same pattern as the DSA tracker.
 * This is a personal single-user tool, not a multi-tenant product, so
 * per-route authorization checks aren't the right shape — one shared
 * credential gating everything is. If APP_USERNAME/APP_PASSWORD aren't
 * set, the app stays open (so local dev isn't accidentally locked out) —
 * but both MUST be set before deploying anywhere reachable from the internet.
 */
export function middleware(req: NextRequest) {
  const validUser = process.env.APP_USERNAME;
  const validPass = process.env.APP_PASSWORD;

  if (!validUser || !validPass) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const encoded = authHeader.slice("Basic ".length);
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    if (user === validUser && pass === validPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Job Match Portal"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
