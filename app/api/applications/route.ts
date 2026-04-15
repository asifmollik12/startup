import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose, { Schema, models } from "mongoose";

const ApplicationSchema = new Schema({
  type: { type: String, enum: ["founder", "startup"] },
  userId: String,
  userName: String,
  userEmail: String,
  status: { type: String, default: "pending" }, // pending, approved, rejected
  data: Schema.Types.Mixed,
}, { timestamps: true });

const Application = models.Application || mongoose.model("Application", ApplicationSchema);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const app = await Application.create(body);
  return NextResponse.json(app, { status: 201 });
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const query = userId ? { userId } : {};
  const apps = await Application.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(apps);
}
