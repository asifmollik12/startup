"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, X, Loader2, Volume2 } from "lucide-react";

type Message = { role: "user" | "ai"; text: string };

export default function VoiceAI() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice not supported in this browser. Use Chrome."); return; }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setTranscript(t);
    };
    rec.onend = () => {
      setListening(false);
      if (transcript.trim()) sendMessage(transcript.trim());
    };
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
    setTranscript("");
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const sendMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: "user", text }]);
    setTranscript("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response.";
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      speak(reply);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1; utt.pitch = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };

  return (
    <>
      {/* Mic button in navbar */}
      <button onClick={() => setOpen(true)}
        className="p-2 text-gray-500 hover:text-brand-red transition-colors relative" aria-label="AI Assistant">
        <Mic size={17} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "80vh" }}>
            {/* Header */}
            <div className="bg-brand-dark px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-red flex items-center justify-center rounded-full">
                  <Mic size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Start-Up News AI</p>
                  <p className="text-gray-400 text-[10px]">Ask anything about Bangladesh startups</p>
                </div>
              </div>
              <button onClick={() => { setOpen(false); stopSpeaking(); stopListening(); }}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-gray">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mic size={24} className="text-brand-red" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Ask me anything</p>
                  <p className="text-gray-400 text-xs mt-1">About founders, startups, articles or ideas</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {["Who is the top founder?", "List fintech startups", "What are the latest articles?"].map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="text-xs bg-white border border-brand-border px-3 py-1.5 text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors">
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
                      : "bg-white border border-brand-border text-gray-700 rounded-2xl rounded-tl-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={14} className="text-brand-red animate-spin" />
                    <span className="text-xs text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              {transcript && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-2.5 text-sm bg-brand-red/20 text-brand-red rounded-2xl rounded-tr-sm italic">
                    {transcript}...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Controls */}
            <div className="px-4 py-4 bg-white border-t border-brand-border flex-shrink-0">
              <div className="flex items-center gap-3">
                {speaking && (
                  <button onClick={stopSpeaking}
                    className="flex items-center gap-1.5 text-xs text-brand-red border border-brand-red px-3 py-2 hover:bg-brand-red hover:text-white transition-colors">
                    <Volume2 size={13} /> Stop
                  </button>
                )}
                <button onClick={listening ? stopListening : startListening}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                    listening
                      ? "bg-red-50 border-2 border-brand-red text-brand-red animate-pulse"
                      : "bg-brand-red text-white hover:bg-red-700"
                  }`}>
                  {listening ? <><MicOff size={16} /> Listening... (tap to send)</> : <><Mic size={16} /> Hold to Speak</>}
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-2">Powered by Google Gemini · Chrome recommended</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
