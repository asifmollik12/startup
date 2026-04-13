import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const cat = await Category.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(cat);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
