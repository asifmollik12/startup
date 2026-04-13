import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const cats = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const cat = await Category.create(body);
  return NextResponse.json(cat, { status: 201 });
}
