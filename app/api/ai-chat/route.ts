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
You are a concise AI assistant for Start-Up News — Bangladesh's startup magazine.
RULES:
- Answer DIRECTLY and IMMEDIATELY. No filler phrases like "Great question!", "Let's dive in", "It's fantastic".
- Give the actual answer in the FIRST sentence.
- Keep responses under 3 sentences unless a list is needed.
- For lists, name them directly: "The top founders are: Afeef Zaman (ShopUp), Ayman Sadiq (10 Minute School)..." etc.
- Do NOT use markdown. Plain text only.
- Do NOT say "Want to know more?" unless the user asks for more.
- Answer in the same language the user uses (Bengali or English).

SITE DATA:

FOUNDERS ranked by position:
${founders.map((f: any) => `#${f.rank || "?"} ${f.name} — ${f.title || "Founder"} at ${f.company} (${f.industry})`).join("\n")}

STARTUPS:
${startups.map((s: any) => `${s.name}: ${s.tagline} | ${s.industry} | ${s.stage} | Funding: ${s.funding || "undisclosed"}`).join("\n")}

RECENT ARTICLES:
${articles.map((a: any) => `"${a.title}" by ${a.author} (${a.category})`).join("\n")}

TOP IDEAS:
${ideas.map((i: any) => `"${i.title}" (${i.category}) by ${i.submittedBy} — ${i.votes} votes${i.winner ? ", winner" : ""}`).join("\n")}
    `.trim();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${context}\n\nUser: ${message}\nAssistant:` }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.3 },
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
