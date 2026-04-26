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
    // Casual conversation — no need to fetch DB data
    const isCasual = /^(hi|hello|hey|how are you|good morning|good evening|good night|thanks|thank you|ok|okay|bye|goodbye|সালাম|হ্যালো|ধন্যবাদ)\b/i.test(message.trim());

    const [founders, startups, articles, ideas] = isCasual ? [[], [], [], []] : await Promise.all([
      Founder.find().select("name company industry rank slug avatar").limit(10).lean(),
      Startup.find().select("name industry stage tagline slug logo").limit(10).lean(),
      ArticleModel.find().select("title category author slug coverImage").limit(6).lean(),
      Idea.find().select("title category votes winner").limit(5).lean(),
    ]);

    // Detect if the user's message is Bengali
    const isBengaliMessage = /[\u0980-\u09FF]/.test(message);

    // Strict language system instruction — placed first so the model honours it
    const langRule = isBengaliMessage
      ? `LANGUAGE RULE: You MUST respond ONLY in Bengali (বাংলা). Every single word of your response must be Bengali. Do NOT write any English words or sentences. If a name or term has a Bengali equivalent use it; otherwise write the English name as-is but the rest must be Bengali.`
      : `LANGUAGE RULE: You MUST respond ONLY in English. Every single word of your response must be English. Do NOT write any Bengali words or sentences.`;

    const context = `${langRule}

You are **Start-Up News AI** — the smart assistant for Start-Up News, Bangladesh's premier startup magazine.
IDENTITY: Only mention your name/creator if directly asked.
CRITICAL RULES:
- For casual greetings like "hi", "hello", "how are you" — respond naturally and briefly. Do NOT pull site data.
- For questions about founders/startups/articles — use the SITE DATA below to answer accurately.
- NEVER include raw URLs, [url:...], or any SOURCES section in your response. Just answer the question.
- Max 2-3 sentences. No filler. No greetings. No sign-offs.
- **bold** names/companies

SITE DATA:

FOUNDERS (with page URLs):
${founders.map((f: any) => `#${f.rank || "?"} ${f.name} — ${f.title || "Founder"} at ${f.company} (${f.industry}) [url:/founders/${f.slug}]`).join("\n")}

STARTUPS (with page URLs):
${startups.map((s: any) => `${s.name}: ${s.tagline} | ${s.industry} | ${s.stage} [url:/startups/${s.slug}]`).join("\n")}

RECENT ARTICLES (with page URLs):
${articles.map((a: any) => `${a.title} by ${a.author} — ${a.category} [url:/articles/${a.slug}]`).join("\n")}

TOP IDEAS:
${ideas.map((i: any) => `${i.title} (${i.category}) by ${i.submittedBy} — ${i.votes} votes${i.winner ? ", winner" : ""}`).join("\n")}

SOURCES RULE: At the end of your answer, if you referenced specific founders, startups, or articles from the data above, add a SOURCES section like this (max 3 sources):
SOURCES:
- [Name or Title](/path/to/page)
    `.trim();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: context }] },
            { role: "model", parts: [{ text: "Got it." }] },
            { role: "user", parts: [{ text: message }] }
          ],
          generationConfig: { maxOutputTokens: 150, temperature: 0.2 },
        }),
      }
    );

    if (!res.ok || !res.body) {
      return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
    }

    // Stream SSE chunks back to client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try {
              const chunk = JSON.parse(json);
              const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
              if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            } catch {}
          }
        }

        // Save usage counter after stream completes
        if (mode !== "voice") {
          user.aiChatCount += 1;
          await user.save();
        }

        // Build resource map for rich source cards
        const resourceMap: Record<string, { title: string; subtitle: string; image: string; href: string; type: string }> = {};
        founders.forEach((f: any) => {
          if (f.slug) resourceMap[`/founders/${f.slug}`] = {
            title: f.name, subtitle: `${f.company} · ${f.industry}`,
            image: f.avatar || "", href: `/founders/${f.slug}`, type: "founder"
          };
        });
        startups.forEach((s: any) => {
          if (s.slug) resourceMap[`/startups/${s.slug}`] = {
            title: s.name, subtitle: s.tagline || s.industry,
            image: s.logo || s.coverImage || "", href: `/startups/${s.slug}`, type: "startup"
          };
        });
        articles.forEach((a: any) => {
          if (a.slug) resourceMap[`/articles/${a.slug}`] = {
            title: a.title, subtitle: `${a.author} · ${a.category}`,
            image: a.coverImage || "", href: `/articles/${a.slug}`, type: "article"
          };
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, remaining: CHAT_LIMIT - user.aiChatCount, resourceMap })}\n\n`));
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
