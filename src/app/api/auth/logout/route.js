import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findSessionByRefreshToken, revokeSession } from "../../../../lib/auth.js";
import { clearRefreshCookie } from "../../../../lib/cookies";

export async function POST() {
  const presented = cookies().get("refresh_token")?.value;
  if (presented) {
    const session = await findSessionByRefreshToken(presented);
    if (session) {
      await revokeSession(session._id.toString());
    }
  }
  clearRefreshCookie();
  return NextResponse.json({ ok: true });
}
