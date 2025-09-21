import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import Session from "../model/Session.js";
import { connectDB } from "../lib/mongodb.js";

const ACCESS_EXP = "5m";
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 30);

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXP });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

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
  });

  return { token, sessionId: session._id.toString() };
}

export async function findSessionByRefreshToken(presentedToken) {
  await connectDB();
  const sessions = await Session.find({ revoked: false });
  for (const s of sessions) {
    const match = await bcrypt.compare(presentedToken, s.refreshTokenHash);
    if (match) return s;
  }
  return null;
}

export async function revokeSession(sessionId) {
  await connectDB();
  await Session.findByIdAndUpdate(sessionId, { revoked: true });
}

export async function revokeAllSessionsForUser(userId) {
  await connectDB();
  await Session.updateMany({ userId }, { revoked: true });
}
