import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findSessionByRefreshToken, generateRefreshToken, revokeSession } from "../../../../lib/auth.js";
import { setRefreshCookie } from "../../../../lib/cookies";
import { signAccessToken } from "../../../../lib/auth.js";

export async function POST(req) {
  const presented = cookies().get("refresh_token")?.value;
  if (!presented) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  const session = await findSessionByRefreshToken(presented);
  if (!session) return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });

  await revokeSession(session._id.toString());
  const { token: newRefresh } = await generateRefreshToken(session.userId, "", "");
  setRefreshCookie(newRefresh);

  const newAccess = signAccessToken({ sub: session.userId });
  return NextResponse.json({ accessToken: newAccess });
}
