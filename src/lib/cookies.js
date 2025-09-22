import { cookies } from "next/headers";

// Set access token
export async function setAccessCookie(value) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "accessToken",
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

// Set refresh token
export async function setRefreshCookie(value) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "refreshToken", // match the same name everywhere
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

// Clear both access and refresh tokens
export async function clearCookies() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "accessToken",
    value: "",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  cookieStore.set({
    name: "refreshToken", // must match the set name
    value: "",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}
