import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

const TTS_LIMIT = 30;

export async function POST(req: NextRequest) {
  try {
    const { text, userId, isBengali } = await req.json();
    if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });

    // Auth required
    if (!userId) return NextResponse.json({ error: "Login required to use voice AI." }, { status: 401 });

    await connectDB();

    const today = new Date().toISOString().slice(0, 10);
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 401 });

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

    // For Bengali: use Google Translate TTS (free, natural bn-BD voice)
    // For English: use ElevenLabs (high quality)
    if (isBengali) {
      // Google Translate TTS — natural Bengali, no API key needed
      // Split into chunks ≤200 chars (GT limit)
      const chunks = splitText(clean, 200);
      const audioBuffers: ArrayBuffer[] = [];

      for (const chunk of chunks) {
        const gtRes = await fetch(
          `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(chunk)}`,
          { headers: { "User-Agent": "Mozilla/5.0" } }
        );
        if (!gtRes.ok) continue;
        audioBuffers.push(await gtRes.arrayBuffer());
      }

      if (audioBuffers.length === 0) {
        return NextResponse.json({ error: "Bengali TTS failed." }, { status: 500 });
      }

      // Merge all chunks into one response
      const total = audioBuffers.reduce((s, b) => s + b.byteLength, 0);
      const merged = new Uint8Array(total);
      let offset = 0;
      for (const buf of audioBuffers) {
        merged.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
      }

      user.ttsCount += 1;
      await user.save();

      return new NextResponse(merged, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-store",
          "X-TTS-Remaining": String(TTS_LIMIT - user.ttsCount),
        },
      });
    }

    // English — ElevenLabs
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
          model_id: "eleven_turbo_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

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

function splitText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  // Split on sentence boundaries first
  const sentences = text.split(/(?<=[।.!?])\s+/);
  let current = "";
  for (const s of sentences) {
    if ((current + s).length <= maxLen) {
      current += (current ? " " : "") + s;
    } else {
      if (current) chunks.push(current);
      // If single sentence is too long, hard-split
      if (s.length > maxLen) {
        for (let i = 0; i < s.length; i += maxLen) chunks.push(s.slice(i, i + maxLen));
      } else {
        current = s;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.filter(Boolean);
}
