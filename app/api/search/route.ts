import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/lib/models/Article";
import { Founder } from "@/lib/models/Founder";
import { Startup } from "@/lib/models/Startup";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json([]);

  await connectDB();
  const regex = new RegExp(q, "i");

  const [articles, founders, startups] = await Promise.all([
    Article.find({ $or: [{ title: regex }, { category: regex }, { author: regex }] })
      .select("title category slug coverImage").limit(4).lean(),
    Founder.find({ $or: [{ name: regex }, { company: regex }, { industry: regex }] })
      .select("name company slug avatar industry").limit(3).lean(),
    Startup.find({ $or: [{ name: regex }, { industry: regex }, { tagline: regex }] })
      .select("name industry slug logo tagline").limit(3).lean(),
  ]);

  const results = [
    ...articles.map((a: any) => ({ type: "article", title: a.title, subtitle: a.category, href: `/articles/${a.slug}`, image: a.coverImage || "" })),
    ...founders.map((f: any) => ({ type: "founder", title: f.name, subtitle: f.company, href: `/founders/${f.slug}`, image: f.avatar || "" })),
    ...startups.map((s: any) => ({ type: "startup", title: s.name, subtitle: s.industry, href: `/startups/${s.slug}`, image: s.logo || "" })),
  ];

  return NextResponse.json(results);
}
