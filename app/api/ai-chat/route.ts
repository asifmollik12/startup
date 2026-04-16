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
You are the friendly AI assistant for Start-Up News — Bangladesh's premier startup magazine.
Respond naturally and conversationally like a knowledgeable friend, NOT like a formal report.
Keep answers concise (2-4 sentences for simple questions, short paragraphs for complex ones).
Do NOT use markdown symbols like **, *, #, or bullet dashes. Write in plain natural language.
Use natural spoken language with varied sentence lengths. Add light expressions like "Great question!", "Interestingly,", "You know what's fascinating?" occasionally.
If listing items, use natural language like "First... then... and finally..."
End responses with a helpful follow-up offer like "Want to know more about any of them?"
Answer in the same language the user uses (Bengali or English).
Be warm, enthusiastic and helpful.

Here is the real data from the site:

FOUNDERS (${founders.length} total):
${founders.map((f: any) => `${f.name} — ${f.title || "Founder"} at ${f.company} (${f.industry}, ${f.location})${f.netWorth && f.netWorth !== "Not public" ? `, net worth ${f.netWorth}` : ""}, rank #${f.rank || "N/A"}`).join("\n")}

STARTUPS (${startups.length} total):
${startups.map((s: any) => `${s.name}: ${s.tagline} | ${s.industry} | ${s.stage} | Funding: ${s.funding || "undisclosed"} | ${s.location}`).join("\n")}

RECENT ARTICLES (${articles.length}):
${articles.map((a: any) => `"${a.title}" by ${a.author} (${a.category})`).join("\n")}

TOP IDEAS (${ideas.length}):
${ideas.map((i: any) => `"${i.title}" (${i.category}) by ${i.submittedBy} — ${i.votes} votes${i.winner ? ", winner" : ""}`).join("\n")}
    `.trim();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-1b-it:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
