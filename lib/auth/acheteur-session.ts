import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
const COOKIE = "shopbook_acheteur";       // ← cookie distinct du commerçant
const MAX_AGE = 60 * 60 * 24 * 30;         // 30 jours (un acheteur revient de temps en temps)

export async function createAcheteurSession(acheteurId: number) {
  const token = await new SignJWT({ acheteurId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getAcheteurSession(): Promise<{ acheteurId: number } | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { acheteurId: payload.acheteurId as number };
  } catch {
    return null;
  }
}

export async function destroyAcheteurSession() {
  const store = await cookies();
  store.delete(COOKIE);
}