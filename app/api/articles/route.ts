import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/lib/models/Article";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const articles = await Article.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const article = await Article.create(body);
  return NextResponse.json(article, { status: 201 });
}
