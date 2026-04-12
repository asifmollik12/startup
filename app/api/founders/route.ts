import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Founder } from "@/lib/models/Founder";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const founders = await Founder.find().sort({ rank: 1 }).lean();
  return NextResponse.json(founders);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const founder = await Founder.create(body);
  return NextResponse.json(founder, { status: 201 });
}
