import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Startup } from "@/lib/models/Startup";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const startups = await Startup.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(startups);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const startup = await Startup.create(body);
  return NextResponse.json(startup, { status: 201 });
}
