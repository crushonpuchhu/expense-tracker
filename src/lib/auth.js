import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import Session from "../model/Session.js";
import { connectDB } from "../lib/mongodb.js";

const ACCESS_EXP = "15m";
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 30);

// Sign JWT access token
export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXP });
}

// Verify access token
export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Generate refresh token per device
export async function generateRefreshToken(userId, ip, deviceInfo) {
  await connectDB();
  const token = randomBytes(64).toString("hex");
  const hash = await bcrypt.hash(token, 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS);

  const session = await Session.create({
    userId,
    refreshTokenHash: hash,
    ip,
    deviceInfo,
    expiresAt,
    revoked: false,
  });

  return { token, sessionId: session._id.toString() };
}

// Find valid session by refresh token
export async function findSessionByRefreshToken(presentedToken) {
  await connectDB();
  const sessions = await Session.find({ revoked: false });
  for (const s of sessions) {
    const match = await bcrypt.compare(presentedToken, s.refreshTokenHash);
    if (match) return s;
  }
  return null;
}

// Revoke a single session
export async function revokeSession(sessionId) {
  await connectDB();
  await Session.findByIdAndUpdate(sessionId, { revoked: true });
}

// Revoke all sessions for a user (logout all devices)
export async function revokeAllSessionsForUser(userId) {
  await connectDB();
  await Session.updateMany({ userId }, { revoked: true });
}

// Verify access token + refresh token
export async function verifyAccessTokenWithSession(accessToken, refreshToken) {
  if (!accessToken) throw new Error("Access token missing");
  if (!refreshToken) throw new Error("Refresh token missing");

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const session = await findSessionByRefreshToken(refreshToken);
  if (!session) throw new Error("Session revoked or invalid");

  return decoded;
}
