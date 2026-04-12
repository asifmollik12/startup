import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "✅ set" : "❌ missing",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ set" : "❌ missing",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ set" : "❌ missing",
    MONGODB_URI: process.env.MONGODB_URI ? "✅ set" : "❌ missing",
  });
}
