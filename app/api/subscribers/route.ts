import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subscriber } from "@/lib/models/Subscriber";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const subs = await Subscriber.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(subs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  try {
    const sub = await Subscriber.create({ email });
    return NextResponse.json(sub, { status: 201 });
  } catch (e: any) {
    if (e.code === 11000) return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { id } = await req.json();
  await Subscriber.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
