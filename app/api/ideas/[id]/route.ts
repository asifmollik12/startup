import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Idea } from "@/lib/models/Idea";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const idea = await Idea.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(idea);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Idea.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
