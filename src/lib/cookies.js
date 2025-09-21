import { cookies } from "next/headers";

// Set refresh token
export async function setRefreshCookie(value) {
  const cookieStore = cookies();
  await cookieStore.set({
    name: "refresh_token",
    value: value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * Number(process.env.REFRESH_TOKEN_DAYS || 30), // 30 days default
  });
}

// Clear refresh token
export async function clearRefreshCookie() {
  const cookieStore = cookies();
  await cookieStore.delete("refresh_token", { path: "/" });
}
