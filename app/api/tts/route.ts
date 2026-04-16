import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

const TTS_LIMIT = 10;

export async function POST(req: NextRequest) {
  try {
    const { text, userId } = await req.json();
    if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });

    // Auth required
    if (!userId) return NextResponse.json({ error: "Login required to use voice AI." }, { status: 401 });

    await connectDB();

    // Daily limit check — only when userId is provided (voice mode auto-speak)
    const today = new Date().toISOString().slice(0, 10);
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 401 });

    // Reset counters if it's a new day
    if (user.aiUsageDate !== today) {
      user.aiChatCount = 0;
      user.ttsCount = 0;
      user.aiUsageDate = today;
    }

    if (user.ttsCount >= TTS_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit reached. You can use voice AI ${TTS_LIMIT} times per day.`, limitReached: true },
        { status: 429 }
      );
    }

    // Clean markdown
    const clean = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*/g, "")
      .replace(/#+\s/g, "")
      .slice(0, 500);

    // Detect if text contains Bengali characters
    const isBengali = /[\u0980-\u09FF]/.test(clean);

    const res = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: clean,
          // eleven_multilingual_v2 supports Bengali; turbo only supports English
          model_id: isBengali ? "eleven_multilingual_v2" : "eleven_turbo_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    // Increment counter after successful response
    user.ttsCount += 1;
    await user.save();

    const audioBuffer = await res.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "X-TTS-Remaining": String(TTS_LIMIT - user.ttsCount),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
