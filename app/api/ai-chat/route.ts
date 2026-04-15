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
You are the AI assistant for Start-Up News — Bangladesh's premier startup and business magazine.
Answer questions based on the following real data from the site.

FOUNDERS (${founders.length}):
${founders.map((f: any) => `- ${f.name}, ${f.title || ""} at ${f.company} (${f.industry}, ${f.location}) ${f.netWorth ? `Net worth: ${f.netWorth}` : ""} Rank: #${f.rank || "N/A"}`).join("\n")}

STARTUPS (${startups.length}):
${startups.map((s: any) => `- ${s.name}: ${s.tagline} | Industry: ${s.industry} | Stage: ${s.stage} | Funding: ${s.funding || "N/A"} | Location: ${s.location}`).join("\n")}

RECENT ARTICLES (${articles.length}):
${articles.map((a: any) => `- "${a.title}" by ${a.author} (${a.category})`).join("\n")}

TOP IDEAS (${ideas.length}):
${ideas.map((i: any) => `- "${i.title}" (${i.category}) by ${i.submittedBy} — ${i.votes} votes${i.winner ? " 🏆 Winner" : ""}`).join("\n")}

Be concise, helpful and friendly. If asked about something not in the data, say you don't have that information yet.
Answer in the same language the user asks (Bengali or English).
    `.trim();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${context}\n\nUser: ${message}` }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
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
