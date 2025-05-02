import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Function to check if the token exists and potentially has a basic structure
// NOTE: This does NOT verify the token's validity against Firebase.
// Verification must happen in a Node.js environment (API route, Server Action, etc.).
function hasPotentiallyValidTokenStructure(token: string | undefined): boolean {
  if (!token) {
    return false;
  }
  try {
    // Check if the cookie value can be parsed as JSON and contains a 'token' property.
    // This matches how the token is stored in AuthContext.
    const cookieData = JSON.parse(token);
    return typeof cookieData.token === "string" && cookieData.token.length > 0;
  } catch (e) {
    // If parsing fails, it's not the expected structure.
    console.warn(
      "Cookie 'auth-token' could not be parsed as JSON in middleware:",
      e
    );
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/signup", "/forgot-password"];

  // Check for the auth token cookie
  const tokenCookie = request.cookies.get("auth-token");
  const token = tokenCookie?.value;

  // Basic check for token presence and structure in the cookie.
  // This is NOT a security verification.
  const hasToken = hasPotentiallyValidTokenStructure(token);

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If user *appears* unauthenticated (no valid-looking token cookie) and trying to access a protected route
  if (!hasToken && !isPublicPath) {
    // Redirect to login page, preserving the originally requested URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    const response = NextResponse.redirect(loginUrl);
    // If there was a token cookie but it was invalid structure, delete it.
    if (tokenCookie && !hasToken) {
      response.cookies.delete("auth-token");
      console.log("Middleware cleared structurally invalid auth token cookie.");
    }
    return response;
  }

  // If user *appears* authenticated (has a valid-looking token cookie) and tries to access login/signup, redirect to home
  // if (hasToken && isPublicPath) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // Allow the request to proceed. Actual token *verification* should happen
  // server-side within the protected route/page logic (using firebase-admin in Node.js runtime).
  const response = NextResponse.next();

  // Clean up invalid structured cookies even if path is allowed
  if (tokenCookie && !hasToken && !isPublicPath) {
    response.cookies.delete("auth-token");
    console.log(
      "Middleware cleared structurally invalid auth token cookie on allowed path."
    );
  }

  return response;
}

// Configure the matcher to run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Also exclude image files directly
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
