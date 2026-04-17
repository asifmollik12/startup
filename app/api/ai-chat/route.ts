import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Founder } from "@/lib/models/Founder";
import { Startup } from "@/lib/models/Startup";
import { Article as ArticleModel } from "@/lib/models/Article";
import { Idea } from "@/lib/models/Idea";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

const CHAT_LIMIT = 50;

export async function POST(req: NextRequest) {
  try {
    const { message, userId, mode } = await req.json();
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 });

    // Auth required
    if (!userId) return NextResponse.json({ error: "Login required to use AI chat." }, { status: 401 });

    await connectDB();

    // Daily limit check
    const today = new Date().toISOString().slice(0, 10);
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 401 });

    // Reset counters if it's a new day
    if (user.aiUsageDate !== today) {
      user.aiChatCount = 0;
      user.ttsCount = 0;
      user.aiUsageDate = today;
    }

    // Voice mode uses TTS credits (checked in /api/tts), text mode uses chat credits
    if (mode !== "voice" && user.aiChatCount >= CHAT_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit reached. You can send ${CHAT_LIMIT} chat messages per day.`, limitReached: true },
        { status: 429 }
      );
    }

    // Hardcoded identity intercept — never let the model answer these
    const lowerMsg = message.toLowerCase().trim();
    const isNameQuestion = /\b(your name|who are you|what are you|what('s| is) your name|তোমার নাম|আপনার নাম|তুমি কে|আপনি কে)\b/.test(lowerMsg);
    const isDevQuestion = /\b(who (made|built|created|developed) you|who('s| is) your (creator|developer|owner|maker)|কে তোমাকে|কে বানিয়েছে|কে তৈরি)\b/.test(lowerMsg);
    const isModelQuestion = /\b(what model|which model|what (api|technology|tech)|powered by|built with|গেমিনি|gemini|gemma|openai|chatgpt)\b/.test(lowerMsg);

    if (isNameQuestion) {
      const reply = /[\u0980-\u09FF]/.test(message)
        ? "আমি **Start-Up News AI** — Start-Up News-এর কৃত্রিম বুদ্ধিমত্তা সহকারী।"
        : "I'm **Start-Up News AI**, the AI assistant for Start-Up News.";
      return NextResponse.json({ reply, remaining: CHAT_LIMIT - user.aiChatCount });
    }
    if (isDevQuestion) {
      const reply = /[\u0980-\u09FF]/.test(message)
        ? "আমাকে **Alphainno** তৈরি করেছে **Start-Up News**-এর জন্য।"
        : "I was developed by **Alphainno** for **Start-Up News**.";
      return NextResponse.json({ reply, remaining: CHAT_LIMIT - user.aiChatCount });
    }
    if (isModelQuestion) {
      const reply = /[\u0980-\u09FF]/.test(message)
        ? "আমি **Alphainno**-এর তৈরি নিজস্ব AI প্রযুক্তি দ্বারা পরিচালিত।"
        : "I'm powered by proprietary AI technology developed by **Alphainno**.";
      return NextResponse.json({ reply, remaining: CHAT_LIMIT - user.aiChatCount });
    }
    const [founders, startups, articles, ideas] = await Promise.all([
      Founder.find().select("name company industry location netWorth rank bio").limit(20).lean(),
      Startup.find().select("name industry stage funding location tagline").limit(20).lean(),
      ArticleModel.find().select("title category author publishedAt excerpt").limit(10).lean(),
      Idea.find().select("title category submittedBy votes winner").limit(10).lean(),
    ]);

    // Detect if the user's message is Bengali
    const isBengaliMessage = /[\u0980-\u09FF]/.test(message);

    // Strict language system instruction — placed first so the model honours it
    const langRule = isBengaliMessage
      ? `LANGUAGE RULE: You MUST respond ONLY in Bengali (বাংলা). Every single word of your response must be Bengali. Do NOT write any English words or sentences. If a name or term has a Bengali equivalent use it; otherwise write the English name as-is but the rest must be Bengali.`
      : `LANGUAGE RULE: You MUST respond ONLY in English. Every single word of your response must be English. Do NOT write any Bengali words or sentences.`;

    const context = `${langRule}

You are **Start-Up News AI** built by **Alphainno**.
IDENTITY RULES:
- ONLY mention your name or creator if the user DIRECTLY asks "what's your name", "who made you", etc.
- For ALL other questions, just answer the question directly. Never introduce yourself unprompted.
FORMAT RULES:
- Use **bold** for names, companies, key terms
- Use bullet points (- item) for lists of 3+ items
- Keep responses concise and scannable

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
          contents: [
            { role: "user", parts: [{ text: context }] },
            { role: "model", parts: [{ text: "Got it." }] },
            { role: "user", parts: [{ text: message }] }
          ],
          generationConfig: { maxOutputTokens: 400, temperature: 0.3 },
        }),
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't process that.";

    // Only increment chat counter for text mode; voice mode credits are counted in /api/tts
    if (mode !== "voice") {
      user.aiChatCount += 1;
      await user.save();
    }

    return NextResponse.json({ reply, remaining: CHAT_LIMIT - user.aiChatCount });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
