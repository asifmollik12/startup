import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Startup } from "@/lib/models/Startup";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const startup = await Startup.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(startup);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Startup.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
