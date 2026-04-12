import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Founder } from "@/lib/models/Founder";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const founder = await Founder.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(founder);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Founder.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
