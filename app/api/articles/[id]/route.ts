import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/lib/models/Article";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const article = await Article.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(article);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Article.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
