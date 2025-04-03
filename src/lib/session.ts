import "server-only";

import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const secretKey = process.env.SESSION_SECRET;

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRATION_DAYS = 30;
const SESSION_EXPIRATION_MS = SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

if (!secretKey)
  throw new Error("SESSION_SECRET is not defined in environment variables.");

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRATION_DAYS}d`)
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = ""
): Promise<JWTPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session:", error);
    return null;
  }
}

export async function createSession(
  userId: string,
): Promise<void> {
  const session = await encrypt({ userId });
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_MS);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await decrypt(session);

  if (!payload) {
    return null;
  }

  const updatedSession = await encrypt(payload);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_MS);

  const response = NextResponse.next();
  response.cookies.set(SESSION_COOKIE_NAME, updatedSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}