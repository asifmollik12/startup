import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const s = await SiteSettings.findOne({ key: "ad_slots" }).lean() as any;
  return NextResponse.json(s?.value ?? []);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const slots = await req.json();
  await SiteSettings.findOneAndUpdate(
    { key: "ad_slots" },
    { key: "ad_slots", value: slots },
    { upsert: true, new: true }
  );
  return NextResponse.json({ success: true });
}
