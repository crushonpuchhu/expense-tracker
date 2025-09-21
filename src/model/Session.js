import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  refreshTokenHash: { type: String, required: true },
  deviceInfo: { type: String },
  ip: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
});

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
