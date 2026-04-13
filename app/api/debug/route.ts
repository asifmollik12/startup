import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.api.ping();
    return NextResponse.json({ status: "✅ Cloudinary connected", result });
  } catch (err: any) {
    return NextResponse.json({ status: "❌ Cloudinary error", error: err?.message });
  }
}
