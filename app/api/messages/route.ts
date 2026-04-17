import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models/Message";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const msgs = await Message.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(msgs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message)
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  const msg = await Message.create({ name, email, subject, message });
  return NextResponse.json(msg, { status: 201 });
}
