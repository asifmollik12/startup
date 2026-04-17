import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models/Message";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { read } = await req.json();
  const msg = await Message.findByIdAndUpdate(params.id, { read }, { new: true });
  return NextResponse.json(msg);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Message.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
