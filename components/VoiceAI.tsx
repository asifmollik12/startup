"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, X, Loader2, Volume2, Send, Zap, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

type Message = { role: "user" | "ai"; text: string; typing?: boolean };

function parseMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const isBullet = /^[\*\-]\s/.test(line.trim());
    const content = isBullet ? line.trim().slice(2) : line;
    const parts = content.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j} className="font-semibold text-gray-900">{p}</strong> : p
    );
    if (isBullet) return (
      <li key={i} className="flex gap-2 items-start py-0.5">
        <span className="text-brand-red mt-1.5 flex-shrink-0 text-[10px]">●</span>
        <span className="flex-1">{rendered}</span>
      </li>
    );
    if (!content.trim()) return null;
    return <p key={i} className="mb-1.5 leading-relaxed">{rendered}</p>;
  }).filter(Boolean);
}

function TypingMessage({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++; setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
        onDone?.();
      }
    }, 6); // faster — syncs better with audio playback
    return () => clearInterval(iv);
  }, [text]);
  return (
    <ul className="space-y-0.5 list-none">
      {parseMarkdown(displayed)}
      {!done && <span className="inline-block w-1 h-4 bg-brand-red animate-pulse ml-0.5 align-middle" />}
    </ul>
  );
}

function VoiceWave() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-brand-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} className="w-1 bg-brand-red rounded-full"
            style={{ height: `${12 + (i % 3) * 8}px`, animation: `voiceBar 0.8s ease-in-out ${i * 0.12}s infinite alternate` }} />
        ))}
        <span className="text-xs text-gray-400 ml-2">Processing...</span>
      </div>
    </div>
  );
}

// Subscription upsell popup shown when a daily limit is hit
function LimitPopup({ type, onClose }: { type: "voice" | "text"; onClose: () => void }) {
  const isVoice = type === "voice";
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
      <div className="bg-white mx-4 shadow-2xl overflow-hidden w-full max-w-sm">
        {/* Top accent */}
        <div className="h-1 bg-brand-red" />
        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-red/10 flex items-center justify-center rounded-full flex-shrink-0">
                <Zap size={18} className="text-brand-red" />
              </div>
              <div>
                <p className="font-bold text-brand-dark text-sm">
                  {isVoice ? "Voice Limit Reached" : "Chat Limit Reached"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Resets tomorrow at midnight</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            {isVoice
              ? "You've used all your daily voice responses. Upgrade to Pro for unlimited voice AI — or keep chatting by text."
              : "You've used all your daily text messages. Upgrade to Pro for unlimited AI access."}
          </p>

          {/* Pro perks */}
          <div className="bg-brand-gray border border-brand-border p-4 mb-5 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Pro includes</p>
            {["Unlimited AI chat messages", "Unlimited voice responses", "Exclusive startup reports", "Founder interviews & podcasts"].map(f => (
              <div key={f} className="flex items-center gap-2">
                <Check size={12} className="text-brand-red flex-shrink-0" />
                <span className="text-xs text-gray-600">{f}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <Link href="/subscribe" onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-brand-red text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
              Upgrade to Pro <ArrowRight size={13} />
            </Link>
            <button onClick={onClose}
              className="w-full text-center py-2.5 border border-brand-border text-sm text-gray-500 hover:border-brand-red hover:text-brand-red transition-colors">
              {isVoice ? "Continue with text" : "Maybe later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CHAT_LIMIT = 50;
const TTS_LIMIT = 30;

export default function VoiceAI() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState<"voice" | "text">("text");
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");
  const [limitPopup, setLimitPopup] = useState<"voice" | "text" | null>(null);
  // Separate counters: voice uses TTS credits, text uses chat credits
  const [chatUsed, setChatUsed] = useState(0);   // text-only
  const [ttsUsed, setTtsUsed] = useState(0);     // voice-only
  const transcriptRef = useRef("");
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    const handler = () => {
      const s = localStorage.getItem("user");
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener("storage", handler);
    window.addEventListener("userLogin", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("userLogin", handler);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript, loading]);

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const stopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    setListening(false);
  };

  const startListening = () => {
    if (!user) { setError("Please sign in to use voice chat."); return; }
    if (ttsUsed >= TTS_LIMIT) { setLimitPopup("voice"); return; }

    // Stop AI speaking first, then wait a moment before listening
    if (speaking) {
      stopAudio();
      setTimeout(() => beginRecognition(), 600);
    } else {
      beginRecognition();
    }
  };

  const beginRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Voice not supported. Use the text box below."); return; }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false; // disable interim — only get final results, no duplicates
    rec.continuous = false;     // single utterance — most reliable on mobile
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      transcriptRef.current = text;
      setTranscript(text);
    };

    rec.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setListening(false);
      const finalText = transcriptRef.current;
      transcriptRef.current = "";
      if (finalText.trim()) sendMessage(finalText.trim(), "voice");
      else setTranscript("");
    };

    rec.onerror = (e: any) => {
      setListening(false);
      if (e.error !== "no-speech") setError(`Mic error: ${e.error}. Try typing instead.`);
    };

    recognitionRef.current = rec;
    rec.start();
    setListening(true);
    setTranscript("");
    setError("");
  };

  // mode: "voice" uses TTS credit, "text" uses chat credit
  const sendMessage = async (text: string, mode: "voice" | "text" = "text") => {
    if (!text.trim() || !user) return;

    if (mode === "voice" && ttsUsed >= TTS_LIMIT) {
      setLimitPopup("voice"); return;
    }
    if (mode === "text" && chatUsed >= CHAT_LIMIT) {
      setLimitPopup("text"); return;
    }

    setMessages(prev => [...prev, { role: "user", text }]);
    setTranscript("");
    setTextInput("");
    setLoading(true);
    setLoadingMode(mode);
    setError("");

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId: user.id, mode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setMessages(prev => prev.slice(0, -1));
      } else {
        const reply = data.reply || "I didn't get a response. Please try again.";

        if (mode === "text") {
          if (data.remaining !== undefined) setChatUsed(CHAT_LIMIT - data.remaining);
          else setChatUsed(c => c + 1);
        }

        // Start TTS fetch immediately in parallel — don't wait for typing to finish
        if (mode === "voice") speak(reply, true);

        // Show typing animation concurrently with audio
        setMessages(prev => [...prev, { role: "ai", text: reply, typing: true }]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, something went wrong." }]);
      setError(e.message);
    }
    setLoading(false);
  };

  // countCredit=true only when called from voice mode (counts TTS credit)
  const speak = async (text: string, countCredit = false) => {
    if (!user) return;
    if (ttsUsed >= TTS_LIMIT) { setLimitPopup("voice"); return; }

    stopAudio();
    setSpeaking(true);

    const isBengali = /[\u0980-\u09FF]/.test(text);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, userId: countCredit ? user.id : null, isBengali }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.limitReached) { setLimitPopup("voice"); setSpeaking(false); return; }
        speakFallback(text);
        return;
      }

      if (countCredit) {
        const remaining = res.headers.get("X-TTS-Remaining");
        if (remaining !== null) setTtsUsed(TTS_LIMIT - parseInt(remaining));
        else setTtsUsed(c => c + 1);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setSpeaking(false); speakFallback(text); };
      audio.play();
    } catch {
      speakFallback(text);
    }
  };

  const speakFallback = (text: string) => {
    if (!window.speechSynthesis) { setSpeaking(false); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*/g, "").replace(/\n+/g, ". ");
    const isBengali = /[\u0980-\u09FF]/.test(clean);
    const utt = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    const preferred = isBengali
      ? voices.find(v => v.lang.startsWith("bn"))
      : voices.find(v => v.name.includes("Google") && v.lang.startsWith("en")) || voices.find(v => v.lang.startsWith("en"));
    if (preferred) utt.voice = preferred;
    utt.rate = 0.92; utt.pitch = 1.0;
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const suggestions = ["Who is the #1 founder?", "List fintech startups", "Latest articles", "Top ideas this month"];
  const chatRemaining = Math.max(0, CHAT_LIMIT - chatUsed);
  const ttsRemaining = Math.max(0, TTS_LIMIT - ttsUsed);

  return (
    <>
      <style>{`
        @keyframes voiceBar {
          from { transform: scaleY(0.4); opacity: 0.6; }
          to   { transform: scaleY(1);   opacity: 1; }
        }
      `}</style>

      {/* Mic button */}
      <button onClick={() => setOpen(true)}
        className="relative p-2 text-gray-500 hover:text-brand-red transition-colors" aria-label="AI Assistant">
        <Mic size={17} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gray-900 rounded-full border border-white" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative" style={{ height: "85vh", maxHeight: "600px" }}>

            {/* Limit popup overlay */}
            {limitPopup && <LimitPopup type={limitPopup} onClose={() => setLimitPopup(null)} />}

            {/* Header */}
            <div className="bg-brand-dark px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 bg-brand-red flex items-center justify-center rounded-full ${listening ? "animate-pulse" : ""}`}>
                  <Mic size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Start-Up News AI</p>
                  <p className="text-gray-400 text-[10px]">
                    {user
                      ? `💬 ${chatRemaining}/${CHAT_LIMIT} text · 🎙 ${ttsRemaining}/${TTS_LIMIT} voice`
                      : "Powered by Alphainno"}
                  </p>
                </div>
              </div>
              <button onClick={() => { setOpen(false); stopAudio(); stopListening(); }}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            {/* Not logged in */}
            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center bg-[#f5f5f0]">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center">
                  <Mic size={28} className="text-brand-red" />
                </div>
                <div>
                  <p className="font-bold text-brand-dark text-base mb-1">Login Required</p>
                  <p className="text-sm text-gray-600 mb-1">Sign in to chat with the AI assistant.</p>
                  <p className="text-xs text-gray-400">{CHAT_LIMIT} text messages · {TTS_LIMIT} voice responses per day</p>
                </div>
                <div className="flex gap-3 w-full max-w-xs">
                  <Link href="/login" onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 border border-brand-border text-sm font-semibold text-gray-700 hover:border-brand-red hover:text-brand-red transition-colors rounded-lg">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-red-700 transition-colors rounded-lg">
                    Join Free
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f0]">
                  {messages.length === 0 && (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Mic size={28} className="text-brand-red" />
                      </div>
                      <p className="text-gray-700 text-sm font-semibold mb-1">Ask me anything</p>
                      <p className="text-gray-400 text-xs mb-4">About founders, startups, articles or ideas on this site</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map(q => (
                          <button key={q} onClick={() => sendMessage(q, "text")}
                            className="text-xs bg-white border border-brand-border px-3 py-1.5 text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors rounded-full">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-brand-red text-white rounded-2xl rounded-tr-sm"
                          : "bg-white border border-brand-border text-gray-700 rounded-2xl rounded-tl-sm shadow-sm"
                      }`}>
                        {m.role === "ai"
                          ? (m.typing
                            ? <TypingMessage text={m.text} onDone={() => setMessages(prev => prev.map((msg, idx) => idx === i ? { ...msg, typing: false } : msg))} />
                            : <ul className="space-y-0.5 list-none">{parseMarkdown(m.text)}</ul>)
                          : m.text}
                      </div>
                    </div>
                  ))}

                  {/* Loading — voice gets wave animation, text gets spinner */}
                  {loading && (
                    loadingMode === "voice"
                      ? <VoiceWave />
                      : (
                        <div className="flex justify-start">
                          <div className="bg-white border border-brand-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                            <Loader2 size={14} className="text-brand-red animate-spin" />
                            <span className="text-xs text-gray-400">Thinking...</span>
                          </div>
                        </div>
                      )
                  )}

                  {transcript && (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] px-4 py-2.5 text-sm bg-brand-red/10 text-brand-red rounded-2xl rounded-tr-sm italic border border-brand-red/20">
                        {transcript}...
                      </div>
                    </div>
                  )}

                  {error && <p className="text-center text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                  <div ref={bottomRef} />
                </div>

                {/* Input area */}
                <div className="px-4 py-3 bg-white border-t border-brand-border flex-shrink-0 space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={textInput}
                      onChange={e => setTextInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage(textInput, "text")}
                      placeholder="Type a question..."
                      disabled={chatUsed >= CHAT_LIMIT || loading}
                      className="flex-1 border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors rounded-lg disabled:opacity-50"
                    />
                    <button onClick={() => sendMessage(textInput, "text")}
                      disabled={!textInput.trim() || loading || chatUsed >= CHAT_LIMIT}
                      className="p-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40">
                      <Send size={15} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={listening ? stopListening : startListening}
                      disabled={loading}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-lg disabled:opacity-40 ${
                        listening
                          ? "bg-red-50 border-2 border-brand-red text-brand-red"
                          : "bg-brand-dark text-white hover:bg-gray-800"
                      }`}>
                      {listening
                        ? <><MicOff size={14} className="animate-pulse" /> Listening...</>
                        : <><Mic size={14} /> Speak</>}
                    </button>
                    {speaking && (
                      <button onClick={stopAudio}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs text-brand-red border border-brand-red rounded-lg hover:bg-brand-red hover:text-white transition-colors">
                        <Volume2 size={13} /> Stop
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
