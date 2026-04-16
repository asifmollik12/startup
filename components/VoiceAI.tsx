"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, X, Send, Volume2, Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";

type Message = { role: "user" | "ai"; text: string };

const CHAT_LIMIT = 20;
const TTS_LIMIT = 10;

export default function VoiceAI() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [chatUsed, setChatUsed] = useState(0);
  const [ttsUsed, setTtsUsed] = useState(0);
  const [error, setError] = useState("");
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
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setMessages((m) => m.slice(0, -1));
      } else {
        setMessages((m) => [...m, { role: "ai", text: data.reply }]);
        setChatUsed((c) => c + 1);
        if (data.remaining !== undefined) setChatUsed(CHAT_LIMIT - data.remaining);
      }
    } catch {
      setError("Network error. Please try again.");
      setMessages((m) => m.slice(0, -1));
    }
    setLoading(false);
  };

  const speakMessage = async (text: string, index: number) => {
    if (speaking === index) {
      audioRef.current?.pause();
      setSpeaking(null);
      return;
    }
    setError("");
    setSpeaking(index);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, userId: user?.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Voice failed.");
        setSpeaking(null);
        return;
      }

      const remaining = res.headers.get("X-TTS-Remaining");
      if (remaining !== null) setTtsUsed(TTS_LIMIT - parseInt(remaining));

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src); }
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setSpeaking(null);
    } catch {
      setError("Voice playback failed.");
      setSpeaking(null);
    }
  };

  const chatRemaining = Math.max(0, CHAT_LIMIT - chatUsed);
  const ttsRemaining = Math.max(0, TTS_LIMIT - ttsUsed);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-500 hover:text-brand-red transition-colors"
        aria-label="AI Assistant"
      >
        <MessageSquare size={17} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="relative w-full sm:w-[420px] sm:max-w-full bg-white shadow-2xl flex flex-col sm:rounded-none max-h-[90vh] sm:max-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-brand-dark text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <Mic size={15} className="text-brand-red" />
                <span className="text-sm font-bold tracking-wide">AI Assistant</span>
              </div>
              {user && (
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare size={10} /> {chatRemaining}/{CHAT_LIMIT}
                  </span>
                  <span className="flex items-center gap-1">
                    <Volume2 size={10} /> {ttsRemaining}/{TTS_LIMIT}
                  </span>
                </div>
              )}
              <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Not logged in */}
            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-14 h-14 bg-brand-red/10 flex items-center justify-center">
                  <Mic size={28} className="text-brand-red" />
                </div>
                <div>
                  <p className="font-bold text-brand-dark text-base mb-1">Login Required</p>
                  <p className="text-sm text-gray-500">Sign in to chat with the AI assistant.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {CHAT_LIMIT} chat messages · {TTS_LIMIT} voice responses per day
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  <Link href="/login" onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 border border-brand-border text-sm font-semibold text-gray-700 hover:border-brand-red hover:text-brand-red transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 bg-brand-red text-white text-sm font-semibold hover:bg-red-700 transition-colors">
                    Join Free
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      <Mic size={32} className="mx-auto mb-3 text-gray-200" />
                      Ask me anything about startups, founders, or articles.
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-brand-red text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        {m.role === "ai" && (
                          <button
                            onClick={() => speakMessage(m.text, i)}
                            className={`mt-1.5 flex items-center gap-1 text-[10px] font-semibold transition-colors ${
                              speaking === i ? "text-brand-red" : "text-gray-400 hover:text-brand-red"
                            }`}
                          >
                            {speaking === i ? <Loader2 size={10} className="animate-spin" /> : <Volume2 size={10} />}
                            {speaking === i ? "Playing..." : `Listen (${ttsRemaining} left)`}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2">
                        <Loader2 size={14} className="animate-spin text-gray-400" />
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="text-xs text-red-500 text-center bg-red-50 px-3 py-2">{error}</div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="border-t border-brand-border p-3 flex-shrink-0">
                  {chatRemaining === 0 ? (
                    <p className="text-xs text-center text-gray-400 py-2">
                      Daily chat limit reached. Resets tomorrow.
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Ask about startups, founders..."
                        className="flex-1 text-sm border border-brand-border px-3 py-2 focus:outline-none focus:border-brand-red"
                        disabled={loading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="px-3 py-2 bg-brand-red text-white hover:bg-red-700 transition-colors disabled:opacity-40"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-300 text-center mt-1.5">
                    {chatRemaining} chats · {ttsRemaining} voice left today
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
