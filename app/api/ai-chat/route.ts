import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Founder } from "@/lib/models/Founder";
import { Startup } from "@/lib/models/Startup";
import { Article as ArticleModel } from "@/lib/models/Article";
import { Idea } from "@/lib/models/Idea";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 });

    await connectDB();

    // Fetch site data for context
    const [founders, startups, articles, ideas] = await Promise.all([
      Founder.find().select("name company industry location netWorth rank bio").limit(20).lean(),
      Startup.find().select("name industry stage funding location tagline").limit(20).lean(),
      ArticleModel.find().select("title category author publishedAt excerpt").limit(10).lean(),
      Idea.find().select("title category submittedBy votes winner").limit(10).lean(),
    ]);

    const context = `
You are the AI assistant for Start-Up News — Bangladesh's startup magazine.
FORMAT RULES:
- Use **bold** for names, companies, key terms
- Use bullet points (- item) for lists of 3+ items
- NO raw quotes around titles — just write the title in bold
- NO parentheses for categories — use a dash or bold label
- Keep responses concise and scannable
- Answer in the same language the user uses (Bengali or English)

SITE DATA:

FOUNDERS:
${founders.map((f: any) => `#${f.rank || "?"} ${f.name} — ${f.title || "Founder"} at ${f.company} (${f.industry})`).join("\n")}

STARTUPS:
${startups.map((s: any) => `${s.name}: ${s.tagline} | ${s.industry} | ${s.stage} | Funding: ${s.funding || "undisclosed"}`).join("\n")}

RECENT ARTICLES:
${articles.map((a: any) => `${a.title} by ${a.author} — ${a.category}`).join("\n")}

TOP IDEAS:
${ideas.map((i: any) => `${i.title} (${i.category}) by ${i.submittedBy} — ${i.votes} votes${i.winner ? ", winner" : ""}`).join("\n")}
    `.trim();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${context}\n\nUser: ${message}\nAssistant:` }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.4 },
        }),
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't process that.";
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
