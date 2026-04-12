import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (key) {
    const setting = await SiteSettings.findOne({ key }).lean();
    return NextResponse.json(setting ? (setting as any).value : null);
  }
  const all = await SiteSettings.find().lean();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { key, value } = await req.json();
  const setting = await SiteSettings.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, new: true }
  );
  return NextResponse.json(setting);
}
