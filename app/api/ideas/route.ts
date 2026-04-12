import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Idea } from "@/lib/models/Idea";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const ideas = await Idea.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const idea = await Idea.create(body);
  return NextResponse.json(idea, { status: 201 });
}
